"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl px-6 py-4 shadow-dream"
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="font-pixel text-sm text-white">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="font-pixel text-xs text-white/60">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-white/60 hover:text-white transition-colors" />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
