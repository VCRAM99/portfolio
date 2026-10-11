import { useTheme, type ThemePreference } from '../../hooks/useTheme'

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export function SiteFooter() {
  const { preference, changeTheme } = useTheme()

  return (
    <footer className="mt-16 border-t border-border py-8 md:mt-20">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">© 2026 Varun Ramanathan.</p>

        <a
          href="#home"
          className="inline-flex min-h-11 items-center text-sm tracking-wide text-foreground underline-offset-4 transition duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent motion-reduce:transition-none"
        >
          Back to Top
        </a>

        <div className="flex items-center gap-3">
          <label htmlFor="theme-select" className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Theme
          </label>
          <select
            id="theme-select"
            value={preference}
            onChange={(event) => changeTheme(event.target.value as ThemePreference)}
            className="min-h-11 rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-accent"
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </footer>
  )
}
