import { CloseIcon, Icon } from '@/components/ui/icon'
import { View } from 'react-native'
import { GAME_TYPES } from 'types-party-battle/types/GameSchema'
import { Heading } from '../../components/ui/heading'
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from '../../components/ui/modal/index'
import { GameTypeToggle } from './GameTypeToggle'

interface LobbyConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LobbyConfigurationModal({ isOpen, onClose }: LobbyConfigurationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">Select Games</Heading>
          <ModalCloseButton onPress={onClose}>
            <Icon as={CloseIcon} className="text-typography-0" size="xl" />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <View className="gap-3">
            <View className="gap-2">
              {GAME_TYPES.map((gameType) => (
                <GameTypeToggle key={gameType} gameType={gameType} />
              ))}
            </View>
          </View>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
