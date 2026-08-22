import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { Modal, Button, Input } from '.'
import {
  departmentSchema,
  type DepartmentFormData,
  HDD_ROOT,
} from '../../schemas/departmentSchema'

interface CreateDeptModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; hddPath: string }) => Promise<void>
  initialValues?: {
    name: string
    folderName: string
  }
  isSubmitting: boolean
}

export function CreateDeptModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isSubmitting,
}: CreateDeptModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
  })

  const folderName = watch('folderName') || ''

  useEffect(() => {
    if (isOpen) {
      reset(
        initialValues ?? {
          name: '',
          folderName: '',
        }
      )
    }
  }, [isOpen, initialValues, reset])

  async function handleFormSubmit(data: DepartmentFormData) {
    try {
      await onSubmit({
        name: data.name,
        hddPath: `${HDD_ROOT}${data.folderName}`,
      })
    } catch (err) {
      const error = err as AxiosError<{
        error: {
          code: string
          message: string
        }
      }>

      if (error.response?.data?.error?.code === 'DUPLICATE_NAME') {
        setError('name', {
          message: 'A department with this name already exists',
        })
      }
    }
  }

  const isEditing = Boolean(initialValues)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit department' : 'Create department'}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Department Name */}
        <Input
          id="name"
          label="Department name"
          placeholder="e.g. Engineering"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* HDD Folder — the root is fixed, so it's shown as an inert prefix. */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="folderName" className="col-label">
            HDD folder
          </label>

          <div className="flex w-full overflow-hidden rounded-md border border-border-default bg-surface transition-colors duration-150 focus-within:border-accent">
            <span className="num flex shrink-0 items-center border-r border-border-default bg-card px-3 py-2.5 text-xs text-text-dim">
              {HDD_ROOT}
            </span>

            <input
              id="folderName"
              className="num min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs text-text-primary outline-none placeholder:text-text-dim"
              placeholder="department-folder"
              {...register('folderName')}
            />
          </div>

          {errors.folderName && (
            <span className="text-[11px] leading-4 text-critical">
              {errors.folderName.message}
            </span>
          )}
        </div>

        {/* Resolved path — the exact string that will be written. */}
        <div className="border-t border-border-subtle pt-4">
          <p className="col-label">Resolves to</p>

          <p className="num mt-1.5 break-all text-[11px] leading-5 text-text-dim">
            {HDD_ROOT}
            <span className="text-accent-light">
              {folderName || '…'}
            </span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 border-t border-border-subtle pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting
              ? 'Saving…'
              : isEditing
                ? 'Save changes'
                : 'Create department'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
