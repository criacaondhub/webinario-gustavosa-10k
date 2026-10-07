import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Footer } from '@/components/sections/Footer'
import { PrivacyPolicy } from '@/components/sections/PrivacyPolicy'

// Política de Privacidade (/protocolo-10k/politica-de-privacidade/) — link no formulário e no rodapé
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivacyPolicy />
    <Footer />
  </StrictMode>,
)
