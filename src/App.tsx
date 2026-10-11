import { SiteLayout } from './components/layout/SiteLayout'
import { useTheme } from './hooks/useTheme'

import { Hero } from './sections/Hero'
import { Experience } from './sections/Experience'
import { Projects } from './sections/Projects'
import { Education } from './sections/Education'
import { Contact } from './sections/Contact'

function App() {
  const { preference, resolvedTheme, changeTheme } = useTheme()

  return (
    <SiteLayout>
      {/* Temporary theme controls; replaced in Milestone 6 */}
      <div className="fixed right-4 bottom-4 z-30 rounded-xl border border-border bg-surface p-3 shadow-lg">
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
        <Projects />
        <Education />
        <Contact />
      </main>
    </SiteLayout>
  )
}
export default App