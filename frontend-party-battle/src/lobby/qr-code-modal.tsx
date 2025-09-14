import { View } from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import { Badge, BadgeText } from '../../components/ui/badge'
import { Button, ButtonText } from '../../components/ui/button'
import { Heading } from '../../components/ui/heading'
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '../../components/ui/modal/index'
import { Text } from '../../components/ui/text'

interface QrCodeModalProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
  roomUrl: string
}

export function QrCodeModal({ isOpen, onClose, roomId, roomUrl }: QrCodeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Join Party QR Code</Heading>
        </ModalHeader>
        <ModalBody>
          <View className="items-center gap-4">
            <View className="items-center gap-2">
              <Text className="text-typography-600 dark:text-typography-400 text-center">
                Scan this QR code or join with the code:
              </Text>
              <Badge variant="outline" action="muted" size="sm">
                <BadgeText className="normal-case">{roomId}</BadgeText>
              </Badge>
            </View>
            <View className="bg-white p-4 rounded-lg">
              <QRCode value={roomUrl} size={200} color="black" backgroundColor="white" />
            </View>
          </View>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" action="primary" onPress={onClose}>
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
