import { useState } from 'react'
import { Button, ButtonText } from '../../components/ui/button'
import { Heading } from '../../components/ui/heading'
import { Input, InputField } from '../../components/ui/input'
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '../../components/ui/modal/index'

interface JoinRoomModalProps {
  isOpen: boolean
  onClose: () => void
  onJoin: (roomId: string) => void
  isLoading?: boolean
}

export function JoinRoomModal({ isOpen, onClose, onJoin, isLoading = false }: JoinRoomModalProps) {
  const [roomId, setRoomId] = useState<string>('')

  const handleJoin = () => {
    if (roomId.trim()) {
      onJoin(roomId.trim())
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Join Party with Code</Heading>
        </ModalHeader>
        <ModalBody>
          <Input variant="outline" size="md" isDisabled={isLoading} isInvalid={false} isReadOnly={false}>
            <InputField value={roomId} onChangeText={setRoomId} placeholder="Input party code..." />
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" action="secondary" onPress={onClose} className="mr-2" isDisabled={isLoading}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button size="sm" action="primary" onPress={handleJoin} isDisabled={!roomId.trim() || isLoading}>
            <ButtonText>{isLoading ? 'Joining...' : 'Join Party'}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
