
import { useTheme } from './hooks/useTheme'

import { Hero } from './sections/Hero'
import { Experience } from './sections/Experience'
import { FeaturedProject } from './sections/FeaturedProject'
import { OtherProjects } from './sections/OtherProjects'
import { Education } from './sections/Education'
import { Contact } from './sections/Contact'

function App() {
  const { preference, resolvedTheme, changeTheme } = useTheme()

  return (
    <>
      {/* Temporary development-only theme controls */}
      <div className="fixed top-4 right-4 z-50 rounded-xl border border-border bg-surface p-3 shadow-lg">
        <label
          htmlFor="theme-select"
          className="mb-2 block text-xs text-muted"
        >
          Theme ({resolvedTheme})
        </label>

        <select
          id="theme-select"
          value={preference}
          onChange={(event) =>
            changeTheme(
              event.target.value as 'system' | 'light' | 'dark'
            )
          }
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <main id="main-content">
        <Hero />
        <Experience />
        <FeaturedProject />
        <OtherProjects />
        <Education />
        <Contact />
      </main>
    </>
  )
}

export default App
