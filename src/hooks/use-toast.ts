
import { useToast as useToastOriginal, toast as toastOriginal } from "@/components/ui/use-toast";

// Re-export the hooks from the ui component
export const useToast = useToastOriginal;
export const toast = toastOriginal;

export default useToast;
