import { ASSETS } from '@/config/content'
import { cn } from '@/lib/utils'

type LogoProps = {
  variant?: 'positive' | 'negative'
  className?: string
}

export function Logo({ variant = 'positive', className }: LogoProps) {
  const { alt, width, height } = ASSETS.logo
  return (
    <img
      src={ASSETS.logo[variant]}
      alt={alt}
      width={width}
      height={height}
      className={cn('block h-auto', className)}
    />
  )
}
