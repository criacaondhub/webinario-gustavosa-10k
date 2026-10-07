import { About } from '@/components/sections/About'
import { Footer } from '@/components/sections/Footer'
import { Hero } from '@/components/sections/Hero'
import { LeadModalProvider } from '@/components/ui/LeadModal'

function App() {
  return (
    <LeadModalProvider>
      <main>
        <Hero />
        <About />
      </main>
      <Footer />
    </LeadModalProvider>
  )
}

export default App
