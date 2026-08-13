import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Modal, Button, Input } from '.'
import { departmentSchema, type DepartmentFormData, HDD_ROOT } from '../../schemas/departmentSchema'

interface CreateDeptModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; hddPath: string }) => Promise<void>
  initialValues?: { name: string; folderName: string }
  isSubmitting: boolean
}

export function CreateDeptModal({ isOpen, onClose, onSubmit, initialValues, isSubmitting }: CreateDeptModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<DepartmentFormData>({ resolver: zodResolver(departmentSchema) })

  const folderName = watch('folderName') || ''

  useEffect(() => {
    if (isOpen) reset(initialValues ?? { name: '', folderName: '' })
  }, [isOpen, initialValues, reset])

  async function handleFormSubmit(data: DepartmentFormData) {
    try {
      await onSubmit({ name: data.name, hddPath: `${HDD_ROOT}${data.folderName}` })
    } catch (err) {
      const error = err as AxiosError<{ error: { code: string; message: string } }>
      // Backend enforces the real uniqueness check — surface it back to the name field
      if (error.response?.data?.error?.code === 'DUPLICATE_NAME') {
        setError('name', { message: 'A department with this name already exists' })
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialValues ? 'Edit department' : 'Create department'}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input id="name" label="Department name" error={errors.name?.message} {...register('name')} />

        <div className="flex flex-col gap-1">
          <label htmlFor="folderName" className="text-sm font-medium text-text-secondary">
            HDD folder
          </label>
          <div className="flex items-center rounded-md border border-border-default bg-surface overflow-hidden">
            <span className="px-3 py-2 text-text-muted text-sm font-mono bg-card border-r border-border-default whitespace-nowrap">
              {HDD_ROOT}
            </span>
            <input
              id="folderName"
              className="flex-1 px-3 py-2 bg-transparent text-text-primary text-sm font-mono outline-none"
              {...register('folderName')}
            />
          </div>
          {errors.folderName && <span className="text-xs text-critical">{errors.folderName.message}</span>}
          <span className="text-xs text-text-muted font-mono">
            Full path: {HDD_ROOT}{folderName || '...'}
          </span>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialValues ? 'Save changes' : 'Create department'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}