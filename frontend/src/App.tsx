import { CartProvider } from './context/CartContext'
import { VariantProvider } from './context/VariantContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Features from './components/sections/Features'
import Gallery from './components/sections/Gallery'
import Purchase from './components/sections/Purchase'
import FAQ from './components/sections/FAQ'

function App() {
  return (
    <VariantProvider>
      <CartProvider>
        <Header />
        <main className="pt-16">
          <Hero />
          <Features />
          <Gallery />
          <Purchase />
          <FAQ />
        </main>
        <Footer />
      </CartProvider>
    </VariantProvider>
  )
}

export default App
