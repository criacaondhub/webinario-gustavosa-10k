import { useState, type ReactNode } from 'react'
import { TbPhoto } from 'react-icons/tb'
import type { MediaAsset } from '@/config/content'
import { cn } from '@/lib/utils'

type MediaFrameProps = {
  asset: MediaAsset
  className?: string
  priority?: boolean
  children?: ReactNode
}

/** Foto de composição. Mostra um placeholder enquanto o arquivo não existe em public/assets/. */
export function MediaFrame({ asset, className, priority = false, children }: MediaFrameProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div
      className={cn('relative min-h-0 min-w-0 overflow-hidden bg-heading/5', className)}
      {...(loaded ? {} : { role: 'img', 'aria-label': asset.alt })}
    >
      <img
        src={asset.file}
        alt={asset.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={cn('absolute inset-0 block size-full object-cover object-top', !loaded && 'invisible')}
      />
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <TbPhoto aria-hidden="true" className="size-11 stroke-1 text-heading/50" />
          <span className="text-label font-bold uppercase tracking-label">{asset.label}</span>
          <span className="flex flex-col gap-1 text-meta text-heading/80">
            <span className="font-bold">{asset.file.replace('assets/', '')}</span>
            <span>
              {asset.size} · {asset.ratio}
            </span>
            <span>salve em public/assets/</span>
          </span>
        </div>
      )}
      {children}
    </div>
  )
}
