export {}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
            auto_select?: boolean
            ux_mode?: 'popup' | 'redirect'
          }) => void
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: string
              theme?: string
              size?: string
              text?: string
              width?: number | string
              locale?: string
            },
          ) => void
        }
      }
    }
  }
}
