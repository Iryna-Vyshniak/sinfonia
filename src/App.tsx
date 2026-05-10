import { MainLayout } from "./components/layout/MainLayout"

import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Gallery from "./components/sections/Gallery";


function App() {
  return (
    <MainLayout>
      <Hero />
      <About />
      <Gallery />
    </MainLayout>
  )
}

export default App
