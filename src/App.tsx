import { MainLayout } from "./components/layout/MainLayout"

import Hero from "./components/sections/Hero";
import About from "./components/sections/About";


function App() {
  return (
    <MainLayout>
      <Hero />
      <About />
    </MainLayout>
  )
}

export default App
