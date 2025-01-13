'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast-container">
      <div className="toast" role="alert" aria-live="polite">
        <div className="toast-content">
          <i className="bi bi-link-45deg"></i>
          <span>{message}</span>
        </div>
        <button className="toast-close" aria-label="Close notification" onClick={onClose}>
          <i className="bi bi-x"></i>
        </button>
      </div>
    </div>
  );
}
