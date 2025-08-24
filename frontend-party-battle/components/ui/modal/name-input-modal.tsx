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

interface NameInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading?: boolean;
}

export function NameInputModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: NameInputModalProps) {
  const [name, setName] = React.useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
      setName("");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Enter Your Name</Heading>
        </ModalHeader>
        <ModalBody>
          <Text className="mb-4 text-typography-600 dark:text-typography-400">
            Please enter your name to join the room.
          </Text>
          <Input
            variant="outline"
            size="md"
            isDisabled={isLoading}
            isInvalid={false}
            isReadOnly={false}
          >
            <InputField
              value={name}
              onChangeText={setName}
              placeholder="Enter your name..."
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
            onPress={handleSubmit}
            isDisabled={!name.trim() || isLoading}
          >
            <ButtonText>Join</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
