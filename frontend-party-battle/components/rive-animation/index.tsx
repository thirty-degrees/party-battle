import type React from 'react'
import { forwardRef } from 'react'
import { Image, Platform, View } from 'react-native'
import Rive, { type RiveRef } from 'rive-react-native'

export type RiveSourceResult = { url: string; resourceName?: never } | { resourceName: string; url?: never }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRiveSource(source: any): RiveSourceResult {
  const { uri } = Image.resolveAssetSource(source)

  // 1. Remote file (http/https) → url
  if (/^https?:\/\//.test(uri)) {
    return { url: uri }
  }

  // 2. iOS – file inside the .app bundle → resourceName = bare filename
  if (/^file:\/\//.test(uri) && Platform.OS === 'ios') {
    const match = uri.match(/.*\.app\/(.*)\.riv$/)
    if (match) return { resourceName: match[1] }
    // EAS/OTA downloaded file – treat as network asset
    return { url: uri }
  }

  // 3. Android release or raw-resource name → resourceName
  return { resourceName: uri }
}

type WrapperProps = Omit<
  React.ComponentProps<typeof Rive>,
  'url' | 'resourceName'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> & { source: any }

export const RiveAnimation = forwardRef<RiveRef, WrapperProps>(({ source, style, ...rest }, ref) => {
  const riveSource = getRiveSource(source)

  return (
    <View style={style}>
      <Rive
        ref={ref}
        {...riveSource}
        onError={(err) => {
          console.error(`${err.type}: ${err.message}`)
        }}
        {...rest}
      />
    </View>
  )
})

RiveAnimation.displayName = 'RiveAnimation'
