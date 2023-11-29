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
import { Context, ContextUpdater } from '../../providers/context';
import { useRouter } from 'next/navigation';
import { useAuthenticate } from '../../helpers/useAuth';
import Link from 'next/link';

interface FormikValues {
  email: string;
  password: string;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

const SignIn = () => {
  const { authToken } = useContext(Context);
  const { isAuthenticated } = useAuthenticate(authToken);
  const { updateUser, updateAuthToken } = useContext(ContextUpdater);
  const [notification, setNotification] = useState<Notification>();
  const router = useRouter();
  
  //Form validator
  const validator = object({
    email: string()
      .required('E-mail is required'),
    password: string()
      .required('Password is required'),
  });

  const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/sign_in`, values);
      setNotification({
        status: 'success',
        message: data.msg
      });

      updateAuthToken(data.token);
      updateUser({ email: data.user.email, id: data.user.id, phoneNo: '', userType: data.user.userType });

      router.push('/customers/new');
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

  if(isAuthenticated) return router.push('/customers/new');

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
            Sign In
          </Typography>

          <Box>
            <Formik
              initialValues={{
                email: '',
                password: '',
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
                      paddingX='2rem'
                    >
                      <TextField name="email" label='E-mail' required />
                      <TextFieldPassword name="password" label='Password' required />
                      <Button variant='contained' type='submit' sx={{ backgroundColor: '#91d000', color: 'white', margin: '0.25rem 0' }}>Sign In</Button>
                      <Box mt='0.5rem'>
                        <Typography fontSize='0.75rem' color='primary' component='span'>Don&apos;t have an account?</Typography>
                        <Link href='/auth/sign_up' style={{ color: 'unset', textDecoration: 'none'}}>
                          <Typography fontSize='0.75rem' px='0.5rem' color='Highlight' component='span'>Sign Up</Typography>
                        </Link>
                      </Box>
                      <Box mt='0.5rem'>
                        <Typography fontSize='0.75rem' color='primary' component='span'>Forgot your password?</Typography>
                        <Link href='/auth/forgot_password' style={{ color: 'unset', textDecoration: 'none'}}>
                          <Typography fontSize='0.75rem' px='0.5rem' color='Highlight' component='span'>Forgot Password</Typography>
                        </Link>
                      </Box>
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

export default SignIn;