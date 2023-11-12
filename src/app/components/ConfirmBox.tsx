import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button'

const ConfrimBox = ({
  children,
  open,
  title,
  onClose,
  onConfirm,
} : {
  children: React.ReactNode,
  open: boolean,
  title: string,
  onClose: () => void,
  onConfirm: () => void,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='error' onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm}>Continue</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfrimBox;