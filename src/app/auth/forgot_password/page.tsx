'use client'
import React, { useState, useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import { Formik, Form, FormikHelpers } from 'formik';
import TextField, { TextFieldPassword } from '../../components/TextField';
import Button from '@mui/material/Button';
import { object, string } from 'yup';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';
import { Notification } from '../../types/notification';
import { useRouter } from 'next/navigation';

interface FormikValues {
  email: string;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ForgotPassword = () => {
  const [notification, setNotification] = useState<Notification>();
  
  //Form validator
  const validator = object({
    email: string()
      .required('E-mail is required'),
  });

  const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/reset_password`, values);
      setNotification({
        status: 'success',
        message: data.msg
      });
      } catch (error: any) {
      if (error.response) {
        return setNotification({
          status: 'error',
          message: error.response.data.err,
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
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        sx={{
          width: '100vw',
          height: '100vh'
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '90%', md: '400px', lg: '400px' },
            margin: 'auto'
          }
        }>
          <Typography
            sx={{
              color: '#91d000',
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem'
            }}
            textAlign='center'
          >
            Reset Password
          </Typography>

          <Box>
            <Formik
              initialValues={{
                email: '',
              }}
              validationSchema={validator}
              onSubmit={onSubmit}
            >
              {
                () => (
                  <Form>
                    <Box
                      display='flex'
                      flexDirection='column'
                    >
                      <TextField name="email" label='E-mail' required />
                      <Button variant='contained' type='submit' sx={{ backgroundColor: '#91d000', color: 'white', margin: '0.25rem 0' }}>Reset</Button>
                    </Box>
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
  );
}

export default ForgotPassword;