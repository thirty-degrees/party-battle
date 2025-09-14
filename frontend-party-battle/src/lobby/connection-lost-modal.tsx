import { Button, ButtonText } from '../../components/ui/button'
import { Heading } from '../../components/ui/heading'
import { Modal, ModalBackdrop, ModalContent, ModalFooter, ModalHeader } from '../../components/ui/modal/index'

interface ConnectionLostModalProps {
  isOpen: boolean
  canRetry: boolean
  onRetry: () => void
  onLeave: () => void
  isLoading?: boolean
}

export function ConnectionLostModal({
  isOpen,
  canRetry,
  onRetry,
  onLeave,
  isLoading = false,
}: ConnectionLostModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={() => {}}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Connection lost</Heading>
        </ModalHeader>
        <ModalFooter>
          {canRetry && (
            <Button size="sm" action="primary" onPress={onRetry} className="mr-2" isDisabled={isLoading}>
              <ButtonText>{isLoading ? 'Retrying...' : 'Retry'}</ButtonText>
            </Button>
          )}
          <Button size="sm" action="secondary" onPress={onLeave} isDisabled={isLoading}>
            <ButtonText>Leave party</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
