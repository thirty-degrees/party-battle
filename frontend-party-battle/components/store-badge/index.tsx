import { TouchableOpacity } from 'react-native'
import AppStoreSvgComponent from './AppStoreSvgComponent'
import GooglePlaySvgComponent from './GooglePlaySvgComponent'

interface StoreBadgeProps {
  os: 'ios' | 'android'
  url: string
}

export default function StoreBadge({ os, url }: StoreBadgeProps) {
  const handlePress = () => {
    if (url && typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
  }

  if (os === 'ios') {
    return (
      <TouchableOpacity onPress={handlePress}>
        <AppStoreSvgComponent />
      </TouchableOpacity>
    )
  }

  if (os === 'android') {
    return (
      <TouchableOpacity onPress={handlePress}>
        <GooglePlaySvgComponent />
      </TouchableOpacity>
    )
  }

  return null
}
