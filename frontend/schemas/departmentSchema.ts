import { z } from 'zod'

const HDD_ROOT = '/mnt/istrac-data/'

export const departmentSchema = z.object({
  name: z.string().min(2, 'Department name is required'),
  // User only types the folder segment — the /mnt/istrac-data/ prefix is enforced, not user-editable
  folderName: z
    .string()
    .min(1, 'Folder name is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
})

export type DepartmentFormData = z.infer<typeof departmentSchema>
export { HDD_ROOT }