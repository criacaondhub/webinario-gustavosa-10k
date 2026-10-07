import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Footer } from '@/components/sections/Footer'
import { ThankYou } from '@/components/sections/ThankYou'

// Página de obrigado (/protocolo-10k/obrigado/) — destino do formulário de inscrição
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThankYou />
    <Footer />
  </StrictMode>,
)
