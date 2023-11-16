'use client'
import React, { useState, useContext } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import { Formik, Form, FormikHelpers } from 'formik';
import TextField from '../../components/TextField';
import Button from '@mui/material/Button';
import { object, string } from 'yup';
import Header from '@/app/components/Header';
import { Notification } from '@/app/types/notification';
import { Alert, Snackbar } from '@mui/material';
import { Context } from '@/app/providers/context';
import { useAuthorize } from '@/app/helpers/useAuth';
import AxiosInstance  from '@/app/services/axios';
import Loader from '@/app/components/Loader';

const BASE_URL = process.env.REACT_APP_BASE_URL;

interface FormikValues {
  name: string;
  belongsTo: string;
  macAddress: string;
  purpose: string;
  location: string;
}

const NewAsset = () => {
  const { authToken } = useContext(Context);
  const { isAuthorized } = useAuthorize(authToken);
  const axios = AxiosInstance.initInstance(authToken);

  const [notification, setNotification] = useState<Notification>();

  const validator = object({
    name: string()
      .required('Please fill out this field.'),
    belongsTo: string()
      // .test({
      //   name: 'ip_test',
      //   test: (value: string = '') => {
      //     console.log(/\[0-9][0-9]/.test(value))
      //     return /[.][0-9]^3/.test(value)
      //   },
      //   message: 'The value you have entered is not a valid IP'
      // })
      .required('Please fill out this field.'),
    macAddress: string()
      // .test({
      //   name: 'mac_address_test',
      //   test: (value: string = '') => {
      //     console.log(/\[0-9][0-9]/.test(value))
      //     return /[.][0-9]^3/.test(value)
      //   },
      //   message: 'The value you have entered is not a valid IP'
      // })
      .required('Please fill out this field.'),
    purpose: string(),
    location: string()
      .required('Please fill out this field.'),
  });

  const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/assets/create`, values);
      setNotification({
        status: 'success',
        message: data.msg
      });

      helpers.resetForm();
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

  if(!isAuthorized) return <Loader />;

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
            Register Asset
          </Typography>

          <Box
            sx={{
              maxWidth: { xs: '80%', md: 'unset'},
              margin: 'auto'
            }}
          >
            <Formik
              initialValues={{
                name: '',
                belongsTo: '',
                macAddress: '',
                purpose: '',
                location: '',
              }}
              validationSchema={validator}
              onSubmit={onSubmit}
            >
              {
                ({ values, setFieldValue, errors, getFieldMeta }) => (
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
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="name" label='Asset Name' required />
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="belongsTo" label='Customer IP Address' required />
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="macAddress" label='Mac Address' required />
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="location" label='Location' required />
                      <TextField sx={{ width: { md: '100%', lg: '100%' }}} name="purpose" label='Purpose' />
                    </Box>
                    <Button variant='contained' type='submit' sx={{ margin: { xs: '1rem 0', md: '0 2rem'} }}>Register</Button>
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

export default NewAsset;