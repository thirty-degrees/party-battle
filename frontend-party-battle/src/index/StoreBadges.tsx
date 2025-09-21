import Constants from 'expo-constants'
import * as Device from 'expo-device'
import { Platform, View } from 'react-native'
import StoreBadge from '../../components/store-badge'

export function StoreBadges() {
  const ANDROID_MARKET_WEB_URL = Constants.expoConfig?.extra?.androidMarketWebUrl
  const IOS_MARKET_WEB_URL = Constants.expoConfig?.extra?.iosMarketWebUrl

  const isWeb = Platform.OS === 'web'
  const osName = Device.osName
  const isAndroidWebBrowser = isWeb && osName === 'Android'
  const isIOSWebBrowser = isWeb && osName === 'iOS'

  if (!isWeb || !osName) {
    return null
  }

  if (isAndroidWebBrowser) {
    return (
      <View className="w-full items-center mb-4">
        <StoreBadge os="android" url={ANDROID_MARKET_WEB_URL} />
      </View>
    )
  }

  if (isIOSWebBrowser) {
    return (
      <View className="w-full items-center">
        <StoreBadge os="ios" url={IOS_MARKET_WEB_URL} />
      </View>
    )
  }

  return (
    <View className="w-full flex-row justify-center gap-4">
      <StoreBadge os="ios" url={IOS_MARKET_WEB_URL} />
      <StoreBadge os="android" url={ANDROID_MARKET_WEB_URL} />
    </View>
  )
}
