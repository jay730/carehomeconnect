
import * as React from "react"

type ToastActionElement = React.ReactElement<unknown>;

type ToastProps = {
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  duration?: number;
  variant?: "default" | "destructive";
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  icon?: React.ReactNode; // Add the icon prop
}

// Simplified placeholder implementation
export const useToast = () => {
  return {
    toast: (props: ToastProps) => {},
    toasts: [],
    dismiss: (toastId?: string) => {}
  };
};

export const toast = (props: ToastProps) => {
  return {
    id: "toast-id",
    dismiss: () => {},
    update: () => {}
  };
};
