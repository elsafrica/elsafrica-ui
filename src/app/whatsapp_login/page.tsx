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
import FormControl from '@mui/material/FormControl';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CircularProgress from '@mui/material/CircularProgress';
import AxiosInstance  from '../services/axios';
import { useAuthorize } from '../helpers/useAuth';
import Loader from '../components/Loader';
import { Roboto } from 'next/font/google';
import { Send } from '@mui/icons-material';
import Textarea from '../components/TextArea';
import { ImageDrop } from '../components/Dropzone';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const roboto = Roboto({ weight: '500', subsets: ['latin'] });

export default function CustomerAccounts() {
  const [notification, setNotification] = useState<Notification>();
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState<boolean>();
  const [message, setMessage] = useState<string>('');
  const [file, setFile] = useState<File>();

  const { authToken, qrCode, isWAConnected } = useContext(Context);
  const { updateQRCode } = useContext(ContextUpdater);
  const axios = AxiosInstance.initInstance(authToken);
  const { isSuperUser } = useAuthorize(authToken);

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

  const testMessage = async () => {
    setLoading(true);

    try {
      const { data } = await axios.get(`${BASE_URL}/messages/send_test_message`);

      setNotification({
        status: 'success',
        message: data.msg
      });
    } catch (error: any) {
      if (error.response) {
        return setNotification({
          status: 'error',
          message: error.response.data.errMsg
        })
      }

      setNotification({
        status: 'error',
        message: error.message
      })
    } finally {
      setLoading(false);
    }
  }

  const broadcastMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!message) return setNotification({
      status: 'error',
      message: 'Please enter your message the submit.'
    });

    const fd = new FormData();
    fd.append('message', message);
    fd.append('file', file || '');

    setIsSending(true);

    try {
      const { data } = await axios.post(`${BASE_URL}/messages/broadcast_message`, fd);

      setNotification({
        status: 'success',
        message: data.msg
      });
    } catch (error: any) {
      if (error.response) {
        return setNotification({
          status: 'error',
          message: error.response.data.errMsg
        })
      }

      setNotification({
        status: 'error',
        message: error.message
      })
    } finally {
      setIsSending(false);
    }
  }

  const onTextAreaChange = (value: string) => setMessage(value);
  const onAccept = (file?: File) => setFile(file);

  if(!isSuperUser) return <Loader />;

  return (
    <>
      <Header />
      <Box
        sx={{
          padding: '2rem',
          display: 'flex',
          justifyContent: { xs: 'unset', md: 'space-between' },
          flexDirection: { xs: 'column', md: 'row' },
          maxWidth: '600px',
          width: '80%',
          mx: 'auto'
        }}
      >
        <Box>
          <Typography
            sx={{
              color: '#91d000',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              margin: '0.5rem 0',
            }}
            component='h4'
            textAlign='start'
        >
          Scan WhatsApp QR Code
        </Typography>
          <Button
            variant='contained'
            onClick={requestQRCode}
            startIcon={<WhatsAppIcon />}
            disabled={loading}
          >
            Request Connection
          </Button>
          <Box
            sx={{
              maxWidth: '200px',
              height: '200px',
              width: '200px',
              marginTop: '1.5rem'
            }}
          >
            { 
              typeof qrCode === 'string' && Boolean(qrCode) ?
              <QRCode
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={qrCode}
              viewBox={`0 0 200 200`}
            />
            : loading && !isWAConnected ?
            <CircularProgress />
            : <></>
            }
          </Box>
          <Button
            variant='contained'
            color='whatsapp'
            onClick={testMessage}
            startIcon={<Send />}
            disabled={!isWAConnected}
            sx={{
              mt: '1rem'
            }}
          >
            Test Message
          </Button>
        </Box>
        <Box>
          <Typography
            sx={{
              color: '#91d000',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              margin: '0.5rem 0',
            }}
            component='h4'
            textAlign='start'
          >
            Broadcast message
          </Typography>
          <Box>
            <form onSubmit={broadcastMessage}>
              <Box
                display='flex'
                flexDirection='column'
                justifyContent='start'
                alignContent='start'
                alignItems='start'
              >
                <FormControl>
                  <Textarea
                    style={{
                      maxWidth: '250px',
                      minWidth: '250px',
                      height: '100px',
                      minHeight: '50px',
                      padding: '1rem',
                      fontSize: '1rem',
                      clear: 'right',
                    }}
                    placeholder='Enter Message'
                    className={roboto.className}
                    onChange={onTextAreaChange}
                  />
                </FormControl>
                <ImageDrop onAccept={onAccept} accept={{
                  'image/jpeg': ['.png', '.webp', '.jpg']
                }}
                />
                <Button disabled={isSending} sx={{ mt: '1rem', clear: 'left' }} type='submit' startIcon={<Send />} color='whatsapp' variant='contained'>Send message</Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Box>
      <Snackbar
        autoHideDuration={1000}
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
      <Snackbar
        autoHideDuration={6000}
        open={Boolean(isWAConnected)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity='success'
          sx={{
            width: '100%'
          }}
        >
          Connected. You can proceed to send messages.
        </Alert>
      </Snackbar>
    </>
  );
}