"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { ToastType } from "@/contexts/NotificationContext";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const toastStyles = {
  success: {
    bg: "bg-green-50 border-green-200",
    text: "text-green-800",
    icon: CheckCircle,
    iconColor: "text-green-600",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    icon: XCircle,
    iconColor: "text-red-600",
  },
  warning: {
    bg: "bg-yellow-50 border-yellow-200",
    text: "text-yellow-800",
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    icon: Info,
    iconColor: "text-blue-600",
  },
};

export const Toast = ({ message, type, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const styles = toastStyles[type];
  const Icon = styles.icon;

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    return () => {
      setIsExiting(true);
    };
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`
        pointer-events-auto
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isExiting ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}
        ${styles.bg} border rounded-lg shadow-lg p-3 sm:p-4
        flex items-start gap-2 sm:gap-3
        w-full
      `}
      role="alert"
    >
      <div className={`flex-shrink-0 ${styles.iconColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${styles.text}`}>{message}</p>
      </div>
      <button
        onClick={handleClose}
        className={`flex-shrink-0 ${styles.text} hover:opacity-70 transition-opacity p-1`}
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
