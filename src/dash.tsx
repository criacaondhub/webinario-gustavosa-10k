import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Dash } from '@/components/dash/Dash'

// Painel de inscrições (/protocolo-10k/dash/) — login nd-protocolo, dados via api/
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Inter no painel inteiro (no body não pega: a regra do body no index.css fica fora de @layer) */}
    <div className="font-form">
      <Dash />
    </div>
  </StrictMode>,
)
