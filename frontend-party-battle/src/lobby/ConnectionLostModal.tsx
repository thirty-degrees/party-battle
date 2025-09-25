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

interface ConnectionLostModalProps {
  isOpen: boolean
  canRetry: boolean
  onRetry: () => void
  isLoading?: boolean
}

export function ConnectionLostModal({
  isOpen,
  canRetry,
  onRetry,
  isLoading = false,
}: ConnectionLostModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader className="justify-center">
          <Heading size="md">Connection lost</Heading>
        </ModalHeader>
        <ModalBody />
        <ModalFooter className="justify-center">
          {canRetry && (
            <Button size="sm" action="primary" onPress={onRetry} className="mr-2" isDisabled={isLoading}>
              <ButtonText>{isLoading ? 'Retrying...' : 'Retry'}</ButtonText>
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
