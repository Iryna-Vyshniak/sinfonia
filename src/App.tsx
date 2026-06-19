import MainLayout from "./components/layout/MainLayout"
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Gallery from "./components/sections/Gallery";
import Testimonials from "./components/sections/Testimonials";
import Repertoire from "./components/sections/Repertoire";
import Tour from "./components/sections/Tour";
import TicketOffcanvas from "./components/modals/TicketOffcanvas";
import { TicketOffcanvasProvider } from "./context/TicketOffcanvasProvider";




function App() {
  return (
    <TicketOffcanvasProvider>
      <MainLayout>
        <Hero />
        <About />
        <Gallery />
        <Testimonials />
        <Repertoire />
        <Tour />
        <TicketOffcanvas />
      </MainLayout>
    </TicketOffcanvasProvider>
  )
}

export default App
