import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { FolderPlus } from 'lucide-react'
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
      title={isEditing ? 'Edit Department' : 'Create Department'}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-5"
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 pb-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-accent/20 bg-accent/10">
            <FolderPlus
              size={15}
              className="text-accent-light"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-text-primary">
              {isEditing
                ? 'Update department'
                : 'New department'}
            </p>

            <p className="text-[11px] text-text-muted">
              Configure the department and storage location.
            </p>
          </div>
        </div>

        {/* Department Name */}
        <Input
          id="name"
          label="Department name"
          placeholder="e.g. Engineering"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* HDD Folder */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="folderName"
            className="text-sm font-medium text-text-secondary"
          >
            HDD folder
          </label>

          <div className="flex w-full overflow-hidden rounded-lg border border-border-default bg-surface transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
            <span className="flex shrink-0 items-center border-r border-border-default bg-card px-3 py-2.5 font-mono text-xs text-text-muted">
              {HDD_ROOT}
            </span>

            <input
              id="folderName"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-mono text-xs text-text-primary outline-none placeholder:text-text-muted"
              placeholder="department-folder"
              {...register('folderName')}
            />
          </div>

          {errors.folderName && (
            <span className="text-xs text-critical">
              {errors.folderName.message}
            </span>
          )}

          {/* Full path preview */}
          <div className="mt-1 rounded-lg border border-border-subtle bg-card/60 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              Full path
            </p>

            <p className="mt-0.5 break-all font-mono text-[11px] text-text-secondary">
              {HDD_ROOT}
              <span className="text-accent-light">
                {folderName || '...'}
              </span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save changes'
                : 'Create department'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}