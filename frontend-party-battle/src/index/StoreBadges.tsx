import Constants from 'expo-constants'
import * as Device from 'expo-device'
import { Platform, View } from 'react-native'
import StoreBadge from 'react-store-badge'

export function StoreBadges() {
  const APPLE_APP_ID = '6751968403'
  const ANDROID_PACKAGE = Constants.expoConfig?.android?.package

  const isWeb = Platform.OS === 'web'
  const isAndroidWebBrowser = isWeb && Device.osName === 'Android'
  const isIOSWebBrowser = isWeb && Device.osName === 'iOS'

  if (!isWeb) {
    return null
  }

  if (isAndroidWebBrowser || isIOSWebBrowser) {
    return (
      <View className="w-full items-center mb-4">
        <StoreBadge
          name="Party Battle"
          googlePlayUrl={`https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`}
          appStoreUrl={`https://apps.apple.com/us/app/party-battle/id${APPLE_APP_ID}`}
        />
      </View>
    )
  }

  return (
    <View className="w-full items-center mb-4 flex-row justify-center gap-4">
      <StoreBadge
        name="Party Battle"
        appStoreUrl={`https://apps.apple.com/us/app/party-battle/id${APPLE_APP_ID}`}
      />
      <StoreBadge
        name="Party Battle"
        googlePlayUrl={`https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`}
      />
    </View>
  )
}
