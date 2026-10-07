import { createContext, useContext } from 'react'

export const LeadModalContext = createContext<() => void>(() => {})

/** Abre o pop-up de inscrição (usado pelos CTAs) */
export const useLeadModal = () => useContext(LeadModalContext)
