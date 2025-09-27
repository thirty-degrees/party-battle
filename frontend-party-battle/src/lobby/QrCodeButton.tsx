import { Button, ButtonIcon } from '@/components/ui/button'
import { QrCodeIcon } from '@/components/ui/icon'
import { QrCodeModal } from '@/src/lobby/QrCodeModal'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { useSharePartyUrl } from '@/src/lobby/useSharePartyUrl'
import { useState } from 'react'

export default function QrCodeButton() {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)

  const roomId = useLobbyStore((state) => state.roomId)
  const shareUrl = useSharePartyUrl()
  const partyCode = roomId || ''

  return (
    <>
      <Button size="md" variant="outline" className="p-2" onPress={() => setIsQrModalOpen(true)}>
        <ButtonIcon as={QrCodeIcon} />
      </Button>

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        roomId={partyCode}
        roomUrl={shareUrl}
      />
    </>
  )
}
