import React from "react";
import { Heading } from "../heading";
import { Text } from "../text";
import { Button, ButtonText } from "../button";
import { Input, InputField } from "../input";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "./index";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomId: string) => void;
  isLoading?: boolean;
}

export function JoinRoomModal({
  isOpen,
  onClose,
  onJoin,
  isLoading = false,
}: JoinRoomModalProps) {
  const [roomId, setRoomId] = React.useState("");

  const handleJoin = () => {
    if (roomId.trim()) {
      onJoin(roomId.trim());
      setRoomId("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Join Room</Heading>
        </ModalHeader>
        <ModalBody>
          <Text className="mb-4 text-typography-600 dark:text-typography-400">
            Enter the room ID to join an existing room.
          </Text>
          <Input
            variant="outline"
            size="md"
            isDisabled={isLoading}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField
              value={roomId}
              onChangeText={setRoomId}
              placeholder="Enter room ID..."
            />
          </Input>
        </ModalBody>
        <ModalFooter>
          <Button
            size="sm"
            action="secondary"
            onPress={onClose}
            className="mr-2"
            isDisabled={isLoading}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            size="sm"
            action="primary"
            onPress={handleJoin}
            isDisabled={!roomId.trim() || isLoading}
          >
            <ButtonText>{isLoading ? "Joining..." : "Join Room"}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
