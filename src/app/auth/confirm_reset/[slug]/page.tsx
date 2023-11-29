'use client'
import React, { useState, useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import { Formik, Form, FormikHelpers } from 'formik';
import { TextFieldPassword } from '../../../components/TextField';
import Button from '@mui/material/Button';
import { object, ref, string } from 'yup';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';
import { Notification } from '../../../types/notification';
import { useParams } from 'next/navigation';

interface FormikValues {
  password: string;
  confirmPassword: string;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ForgotPassword = () => {
  const [notification, setNotification] = useState<Notification>();
  const params = useParams();
  
  //Form validator
  const validator = object({
    password: string()
      .required('E-mail is required'),
    confirmPassword: string()
      .oneOf([ref('password')], 'Your passwords don\'t match.')
  });

  const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/new_password`, {
        sentToken: params.slug,
        ...values
      });
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
                password: '',
                confirmPassword: '',
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
                      <TextFieldPassword name="password" label='Password' required sx={{
                        width: '100%'
                      }} />
                      <TextFieldPassword name="confirmPassword" label='Confirm Password' required sx={{
                        width: '100%'
                      }} />
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