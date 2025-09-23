import type { ReactNode } from 'react'

declare module 'react-native-svg/lib/typescript/web/types' {
  interface BaseProps {
    children?: ReactNode
  }
}

declare module 'react-native-svg/src/web/types' {
  interface BaseProps {
    children?: ReactNode
  }
}
