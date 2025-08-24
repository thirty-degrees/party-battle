import React from "react";
import { View } from "react-native";
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

interface ModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomId: string) => void;
  isLoading?: boolean;
}

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

interface NameInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  isLoading?: boolean;
}

export function ModalComponent({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}: ModalComponentProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">{title}</Heading>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        {showCloseButton && (
          <ModalFooter>
            <Button
              size="sm"
              action="secondary"
              onPress={onClose}
              className="mr-2"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
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

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "OK",
  onConfirm,
}: AlertModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">{title}</Heading>
        </ModalHeader>
        <ModalBody>
          <Text className="text-typography-600 dark:text-typography-400">
            {message}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button size="sm" action="primary" onPress={handleConfirm}>
            <ButtonText>{confirmText}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
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
