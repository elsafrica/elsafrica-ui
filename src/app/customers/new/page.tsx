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

const BASE_URL = process.env.REACT_APP_BASE_URL;

interface FormikValues {
  firstName: string;
  lastName: string;
  phone1: string;
  phone2: string;
  location: string;
  ip: string;
  package: string;
  email: string;
  customAmount: string;
}

const NewCustomer = () => {
  const [notification, setNotification] = useState<Notification>();

  const { authToken } = useContext(Context);
  const { isAuthenticated } = useAuthenticate(authToken);

  const axios = AxiosInstance.initInstance(authToken);

  const fetchPackages = async () : Promise<{
		packages: Array<any>,
	}> => {
		 const data = (await axios.get(`${BASE_URL}/packages/get`)).data;
		
		return data;
	}

  const { data } = useQuery({
    queryKey: ['packages'],
    queryFn: () => fetchPackages(),
    onError: (error: AxiosError<{ msg: string }>) => {
      if(error.response) {
        setNotification({
          status: 'error',
          message: error?.response.data.msg,
        });
      }
      setNotification({
        status: 'error',
        message: error.message,
      });
    }
  })

  const validator = object({
    firstName: string()
      .required('Please fill out this field.'),
    lastName: string()
      .required('Please fill out this field.'),
    phone1: string()
      .required('Please fill out this field.'),
    phone2: string(),
    email: string()
      .required('Please fill out this field.'),
    ip: string()
      .test({
        name: 'ip_address_test',
        test: (value: string | undefined) => /^(\.\d\d\d$)|(\.\d\d$)/.test(value || ''),
        message: 'The value you have entered is not a valid IP address, use the format .72 or .192'
      })
      .required('Please fill out this field.'),
    location: string()
      .required('Please fill out this field.'),
    package: string()
      .required('Please fill out this field.'),
    customAmount: string()
      .when('package', (values, schema) => {
        if(values[0] === 'Custom') return schema.required('Please fill out this field.');
        return schema;
      }),
  });

  const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/customers/new`, values);
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
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                phone1: '',
                phone2: '',
                email: '',
                location: '',
                ip: '',
                package: '',
                customAmount: ''
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
                        marginBottom: { md: '1rem' },
                        flexWrap: { md: 'wrap' },
                        justifyContent: { md: 'space-between' }
                      }}
                    >
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="firstName" label='Customer First Name' required />
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="lastName" label='Customer Last Name' required />
                      <TelTextField value={values.phone1} setFieldValue={setFieldValue} sx={{ width: { md: '48%', lg: '48%' }}} name="phone1" label='Primary Phone' required />
                      <TelTextField value={values.phone2} setFieldValue={setFieldValue} sx={{ width: { md: '48%', lg: '48%' }}} name="phone2" label='Secondary Phone' />
                      <TextField sx={{ width: { md: '100%', lg: '100%' }}} name="email" label='Email' />
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="location" label='Location/Apartment' required />
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="ip" label='IP Address' required />
                      <Select
                        sx={{ width: { md: '48%', lg: '48%' }}}
                        label='Package' 
                        value={values.package} 
                        values={data?.packages?.concat([{ name: 'Custom' }]).map((item: { name: string, amount: string }) => item.name) || []} 
                        onChange={(value) => {setFieldValue('package', value)}}
                        isError={Boolean(getFieldMeta('package') && errors.package)}
                        error={errors.package}
                      />
                      { values.package === 'Custom' && <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="customAmount" label='Custom Amount' required />}
                    </Box>
                    <Button variant='contained' type='submit' sx={{ margin: { xs: '1rem 0', md: '0 2rem'} }}>Onboard Customer</Button>
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

export default NewCustomer;