import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/** Ensina ao tailwind-merge os tamanhos de fonte do @theme (index.css); sem isso, text-headline e text-heading
 *  são lidos como duas cores e um deles é descartado. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: { text: ['display', 'headline', 'statement', 'lead', 'body', 'meta', 'label', 'cta'] },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
