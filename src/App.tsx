import { MainLayout } from "./components/layout/MainLayout"

import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Gallery from "./components/sections/Gallery";
import Testimonials from "./components/sections/Testimonials";


function App() {
  return (
    <MainLayout>
      <Hero />
      <About />
      <Gallery />
      <Testimonials />
    </MainLayout>
  )
}

export default App
