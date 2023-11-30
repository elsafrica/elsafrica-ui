'use client'
import React, { useContext, useState } from 'react'
import { useQuery } from 'react-query'
import { AxiosError } from 'axios';
import AxiosInstance  from '@/app/services/axios';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import { Formik, Form, FormikHelpers } from 'formik';
import TextField, { TelTextField } from '../../components/TextField';
import Button from '@mui/material/Button';
import { object, string } from 'yup';
import Header from '@/app/components/Header';
import Select from '@/app/components/Select';
import { Notification } from '@/app/types/notification';
import { Alert, Snackbar } from '@mui/material';
import { Context } from '@/app/providers/context';
import { useAuthenticate } from '@/app/helpers/useAuth';
import Loader from '@/app/components/Loader';
import Dropzone from '@/app/components/Dropzone';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const NewCustomer = () => {
  const [notification, setNotification] = useState<Notification>();

  const { authToken } = useContext(Context);
  const { isAuthenticated } = useAuthenticate(authToken);

  const axios = AxiosInstance.initInstance(authToken);

  const onSubmit = async (value: File | undefined) => {
    if (!value) return setNotification({
      status: 'error',
      message: 'Please select a file to continue',
    });
    
    const formData = new FormData();
    formData.append('file', value || '');

    try {
      const { data } = await axios.post(`${BASE_URL}/customers/upload_csv`, formData);
      setNotification({
        status: 'success',
        message: data.msg
      });
      } catch (error: any) {
      if (error.response) {
        setNotification({
          status: 'error',
          message: error.response.data.msg,
        });
      }

      setNotification({
        status: 'error',
        message: error.message,
      });
    }
  }

  const handleNotificationClose = () => setNotification(undefined);

  if(!isAuthenticated) return <Loader />;

  return (
    <>
      <Header />
      <Box
        sx={{
          width: '100vw',
        }}
      >
        <Box
          sx={{
            maxWidth: { md: '60%', xl: '60%' },
            margin: 'auto'
          }}
        >
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
            New Customer Onboarding
          </Typography>

          <Box
            sx={{
              maxWidth: { xs: '80%', md: 'unset'},
              margin: 'auto'
            }}
          >
           <Dropzone onSubmit={onSubmit} accept={{
            'text/csv': ['.csv']
           }} />
          </Box>
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
  )
}

export default NewCustomer;