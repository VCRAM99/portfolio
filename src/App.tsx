import { SiteLayout } from './components/layout/SiteLayout'

import { Hero } from './sections/Hero'
import { Experience } from './sections/Experience'
import { Projects } from './sections/Projects'
import { Education } from './sections/Education'
import { Contact } from './sections/Contact'

function App() {
  return (
    <SiteLayout>
      <main id="main-content">
        <Hero />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
    </SiteLayout>
  )
}
export default App