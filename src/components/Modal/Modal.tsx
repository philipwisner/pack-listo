"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  gate?: string;
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  gate = "A-01",
  children,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <div>
          <div>
            <span>GATE</span>
            <span>{gate}</span>
          </div>
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
