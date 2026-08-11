interface AvatarProps {
  name: string
  src?: string
  shape?: 'circle' | 'square'
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-14 h-14 text-lg',
}

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

export function Avatar({ name, src, shape = 'circle', size = 'md' }: AvatarProps) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-md'

  if (src) {
    return <img src={src} alt={name} className={`${sizeStyles[size]} ${shapeClass} object-cover border border-border-default`} />
  }

  return (
    <div className={`${sizeStyles[size]} ${shapeClass} bg-surface border border-border-default text-accent-light flex items-center justify-center font-medium`}>
      {getInitials(name)}
    </div>
  )
}