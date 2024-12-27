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
          border: "1px solid white",
          borderRadius: "24px",
          color: "white",
          padding: "24px",
        },
      }}
    >
      <DialogTitle
        sx={{
          marginBottom: "16px",
          color: "white",
          fontSize: "20px",
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
