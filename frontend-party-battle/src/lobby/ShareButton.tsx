import { Button, ButtonIcon } from '@/components/ui/button'
import { ShareIcon } from '@/components/ui/icon'
import { useSharePartyUrl } from '@/src/lobby/useSharePartyUrl'
import { Share } from 'react-native'

export default function ShareButton() {
  const shareUrl = useSharePartyUrl()

  const handleShare = async () => {
    try {
      await Share.share({
        url: shareUrl,
      })
    } catch {}
  }

  return (
    <Button size="md" variant="outline" className="p-2" onPress={handleShare}>
      <ButtonIcon as={ShareIcon} />
    </Button>
  )
}
