import { MainLayout } from "./components/layout/MainLayout"

import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Gallery from "./components/sections/Gallery";
import Testimonials from "./components/sections/Testimonials";
import  Repertoire  from "./components/sections/Repertoire";
import Tour  from "./components/sections/Tour";


function App() {
  return (
    <MainLayout>
      <Hero />
      <About />
      <Gallery />
      <Testimonials />
      <Repertoire />
      <Tour />
    </MainLayout>
  )
}

export default App
