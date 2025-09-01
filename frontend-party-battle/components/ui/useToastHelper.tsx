import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

export default function useToastHelper() {
  const toast = useToast();

  const showError = (title: string, description: string) => {
    toast.show({
      render: ({ id }) => (
        <Toast action="error" variant="solid">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </Toast>
      ),
    });
  };

  const showSuccess = (title: string, description: string) => {
    toast.show({
      render: ({ id }) => (
        <Toast action="success" variant="solid">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </Toast>
      ),
    });
  };

  const showWarning = (title: string, description: string) => {
    toast.show({
      render: ({ id }) => (
        <Toast action="warning" variant="solid">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </Toast>
      ),
    });
  };

  const showInfo = (title: string, description: string) => {
    toast.show({
      render: ({ id }) => (
        <Toast action="info" variant="solid">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{description}</ToastDescription>
        </Toast>
      ),
    });
  };

  return {
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
};
