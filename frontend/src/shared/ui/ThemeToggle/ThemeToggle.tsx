import { Monitor, Moon, Sun } from 'lucide-react'
import { setTheme, useTheme, type ThemeChoice } from '@/shared/lib/theme'
const options: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Светлая тема', icon: Sun },
  { value: 'system', label: 'Как в системе', icon: Monitor },
  { value: 'dark', label: 'Тёмная тема', icon: Moon },
]
export function ThemeToggle() {
  const theme = useTheme()
  return (
    <div className="theme-toggle" role="group" aria-label="Тема оформления">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          aria-label={label}
          title={label}
          aria-pressed={theme === value}
          onClick={() =>
            // On phones only the active icon is shown, so tapping it moves to the next theme.
            setTheme(
              theme === value && matchMedia('(max-width: 640px)').matches
                ? options[(options.findIndex((o) => o.value === value) + 1) % options.length].value
                : value,
            )
          }
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  )
}
