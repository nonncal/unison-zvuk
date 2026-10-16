import { Monitor } from 'lucide-react'
import { appMode } from '@/shared/config'
export function ModeNotice() {
  return appMode === 'demo' ? (
    <div className="mode-notice">
      <Monitor size={15} />
      <span>Локальная демоверсия · приглашение работает в другом окне этого браузера</span>
    </div>
  ) : null
}
