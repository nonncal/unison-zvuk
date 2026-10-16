export class AppError extends Error {
  code: string
  constructor(code: string, message: string) {
    super(message)
    this.name = 'AppError'
    this.code = code
  }
}
export function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Не удалось выполнить действие. Попробуйте снова.'
}
