"use client";

import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        ".MuiDialog-paper": {
          backgroundColor: "black",
          border: "1px solid #52525b",
          borderRadius: "24px",
          color: "var(--text-primary)",
          padding: "24px",
        },
      }}
    >
      <DialogTitle
        sx={{
          marginBottom: "32px",
          color: "white",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
