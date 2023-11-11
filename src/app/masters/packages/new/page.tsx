'use client'
import React, { useState } from 'react'
import axios from 'axios';
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import { Formik, Form, FormikHelpers } from 'formik';
import TextField from '@/app/components/TextField';
import Button from '@mui/material/Button';
import { object, string } from 'yup';
import Header from '@/app/components/Header';
import { Notification } from '@/app/types/notification';
import { Alert, Snackbar } from '@mui/material';

const BASE_URL = process.env.REACT_APP_BASE_URL;

interface FormikValues {
  name: string;
  amount: string
}

const NewPackage = () => {
  const [notification, setNotification] = useState<Notification>()

  const validator = object({
    amount: string()
      .required('Please fill out this field.'),
    name: string()
      .required('Please fill out this field.'),
  });

  const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/packages/create`, values);
      setNotification({
        status: 'success',
        message: data.msg
      });

      helpers.resetForm();
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
            New Package
          </Typography>

          <Box
            sx={{
              maxWidth: { xs: '80%', md: 'unset'},
              margin: 'auto'
            }}
          >
            <Formik
              initialValues={{
                amount: '',
                name: ''
              }}
              validationSchema={validator}
              onSubmit={onSubmit}
            >
              {
                () => (
                  <Form>
                    <Box
                      display='flex'
                      sx={{
                        padding: { md: '1rem 2rem 0' },
                        flexDirection: { xs: 'column', md: 'row' },
                        margin: 'auto',
                        flexWrap: { md: 'wrap' },
                        justifyContent: { md: 'space-between' }
                      }}
                    >
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="name" label='Package Name' required />
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="amount" label='Amount' required />
                    </Box>
                    <Button variant='contained' color='info' type='submit' sx={{ margin: { xs: '1rem 0', md: '0 2rem'} }}>Create Package</Button>
                  </Form>
                )
              }
            </Formik>
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

export default NewPackage;