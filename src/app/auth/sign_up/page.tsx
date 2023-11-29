'use client'
import React, { useState, useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import { Formik, Form, FormikHelpers } from 'formik';
import TextField, { TelTextField, TextFieldPassword } from '../../components/TextField';
import Button from '@mui/material/Button';
import { object, ref, string } from 'yup';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';
import { Notification } from '../../types/notification';
import { Context, ContextUpdater } from '../../providers/context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormikValues {
  firstName: string;
  lastName: string;
  phoneNo: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

const SignUp = () => {
  const { authToken } = useContext(Context);
  const { updateUser, updateAuthToken } = useContext(ContextUpdater);
  const [notification, setNotification] = useState<Notification>();
  const router = useRouter();
  
  //Form validator
  const validator = object({
    firstName: string()
      .required('Please enter your first name'),
    lastName: string()
      .required('Please enter your last name'),
    email: string()
      .email('Please enter a valid E-mail address.')
      .required('E-mail is required'),
    password: string()
      .required('Password is required'),
    confirmPassword: string()
      .oneOf([ref('password')], 'Your passwords don\'t match.'),
    phoneNo: string()
      .required('Phone number is a required field'),
    
  });

  const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/auth/sign_up`, values);
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
            maxWidth: { xs: '90%', md: '600px', lg: '600px' },
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
            Sign Up
          </Typography>

          <Box>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                phoneNo: '',
                email: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={validator}
              onSubmit={onSubmit}
            >
              {
                ({ values, setFieldValue }) => (
                  <Form>
                    <Box
                      display='flex'
                      flexDirection='row'
                      justifyContent='space-between'
                      flexWrap='wrap'
                      paddingX='2rem'
                    >
                      <TextField name="firstName" label='First Name' required sx={{
                        width: { xs: '100%', md: '48%', lg: '48%'}
                      }} />
                      <TextField name="lastName" label='Last Name' required sx={{
                        width: { xs: '100%', md: '48%', lg: '48%'}
                      }} />
                      <TextField name="email" label='E-mail' required sx={{ width: '100%' }} />
                      <TelTextField name="phoneNo" label='Phone Number' required sx={{ width: '100%' }} setFieldValue={setFieldValue} value={values.phoneNo} />
                      <TextFieldPassword name="password" label='Password' required sx={{
                        width: { xs: '100%', md: '48%', lg: '48%'}
                      }} />
                      <TextFieldPassword name="confirmPassword" label='Confirm Password' required sx={{
                        width: { xs: '100%', md: '48%', lg: '48%'}
                      }} />
                      <Box width='100%'>
                        <Button variant='contained' type='submit' sx={{ backgroundColor: '#91d000', color: 'white', margin: '0.25rem 0' }}>Sign In</Button>
                      </Box>
                      <Box mt='0.5rem'>
                        <Typography color='primary' component='span'>Already have an account?</Typography>
                        <Link href='/auth/sign_in' style={{ color: 'unset', textDecoration: 'none'}}>
                          <Typography px='0.5rem' color='fuchsia' component='span'>Sign Up</Typography>
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

export default SignUp;