import { toastManager } from "@/components/ui/toast";

type ToastType = "error" | "success" | "warning" | "info";

function show(type: ToastType, message: string, title?: string) {
  toastManager.add({
    type,
    title: title ?? (type === "error" ? "Error" : type === "success" ? "Success" : type === "warning" ? "Warning" : "Info"),
    description: message,
  });
}

export const toast = {
  error: (message: string, title?: string) => show("error", message, title),
  success: (message: string, title?: string) => show("success", message, title),
  warning: (message: string, title?: string) => show("warning", message, title),
  info: (message: string, title?: string) => show("info", message, title),
};
