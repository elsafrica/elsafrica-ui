import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { SxProps } from '@mui/material';

const Modal = ({
  children,
  open,
  title,
  fullWidth = false,
  maxWidth = 'sm',
  onClose,
} : {
  children: React.ReactNode,
  open: boolean,
  title: string,
  fullWidth?: boolean,
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl',
  onClose: () => void,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth}>
      <DialogTitle>{title}</DialogTitle>
      {children}
    </Dialog>
  )
}

export default Modal