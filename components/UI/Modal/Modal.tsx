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
          backgroundColor: "#c0ff00",
          border: "1px solid #black",
          borderRadius: "24px",
          color: "black",
          padding: "24px",
        },
      }}
    >
      <DialogTitle
        sx={{
          marginBottom: "32px",
          color: "black",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
