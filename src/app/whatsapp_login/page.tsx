'use client'
import React, { useState, useContext } from 'react';
import Header from '@/app/components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Notification } from '@/app/types/notification';
import { Context, ContextUpdater } from '../providers/context';
import QRCode from 'react-qr-code';
import Button from '@mui/material/Button';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CircularProgress from '@mui/material/CircularProgress';
import AxiosInstance  from '../services/axios';
import { useAuthorize } from '../helpers/useAuth';
import Loader from '../components/Loader';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function CustomerAccounts() {
  const [notification, setNotification] = useState<Notification>();
  const [loading, setLoading] = useState(false);

  const { authToken, qrCode } = useContext(Context);
  const { updateQRCode } = useContext(ContextUpdater);
  const axios = AxiosInstance.initInstance(authToken);
  const { isAuthorized } = useAuthorize(authToken);

  const handleNotificationClose = () => setNotification(undefined);

  const requestQRCode = async () => {
    updateQRCode('');
    setLoading(true);

    try {
      const { data } = await axios.get(`${BASE_URL}/messages/init_client`);

      setNotification({
        status: 'success',
        message: data.msg
      });
    } catch (error: any) {
      if (error.response) {
        setNotification({
          status: 'error',
          message: error.response.data.msg
        })
      }

      setNotification({
        status: 'error',
        message: error.message
      })
    }
  }

  if(!isAuthorized) return <Loader />;

  return (
    <>
      <Header />
      <Box>
        <Typography
          sx={{
            color: '#91d000',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            margin: '1.5rem 1rem 0.5rem',
          }}
          component='h1'
          textAlign='start'
        >
          Scan WhatsApp QR Code
        </Typography>
      </Box>
      <Box
        sx={{
          padding: '2rem'
        }}
      >
        <Button
          variant='contained'
          onClick={requestQRCode}
          startIcon={<WhatsAppIcon />}
          disabled={!Boolean(qrCode) && loading}
        >
          Request QR Code
        </Button>
        <Box
          sx={{
            maxWidth: '200px',
            marginTop: '1.5rem'
          }}
        >
          { 
            typeof qrCode === 'string' && Boolean(qrCode) ?
            <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={qrCode}
            viewBox={`0 0 256 256`}
          />
          : loading ?
          <CircularProgress />
          : <></>
          }
        </Box>
      </Box>
      <Snackbar
        autoHideDuration={6000}
        open={Boolean(notification)}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert
          severity={notification?.status}
          sx={{
            width: '100%'
          }}
          onClose={handleNotificationClose}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </>
  );
}