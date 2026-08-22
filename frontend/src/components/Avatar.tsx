interface AvatarProps {
  name: string
  src?: string
  shape?: 'circle' | 'square'
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: 'w-7 h-7 text-[10px]',
  md: 'w-9 h-9 text-[11px]',
  lg: 'w-14 h-14 text-base',
}

function getInitials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
}

/**
 * Initials are an identifier, so they're set in mono — same treatment as any
 * other short code in the interface.
 */
export function Avatar({ name, src, shape = 'circle', size = 'md' }: AvatarProps) {
  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-md'

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeStyles[size]} ${shapeClass} border border-border-default object-cover`}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`${sizeStyles[size]} ${shapeClass} num flex shrink-0 items-center justify-center border border-border-default bg-card-hover tracking-[0.06em] text-accent-light`}
    >
      {getInitials(name)}
    </div>
  )
}
