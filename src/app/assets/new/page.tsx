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
import Alert from '@mui/material/Alert';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Snackbar from '@mui/material/Snackbar';
import { Context } from '@/app/providers/context';
import { useAuthorize } from '@/app/helpers/useAuth';
import AxiosInstance  from '@/app/services/axios';
import Loader from '@/app/components/Loader';
import Select from '@/app/components/Select';

const BASE_URL = process.env.REACT_APP_BASE_URL;

interface FormikValues {
  name: string;
  belongsTo: string;
  macAddress: string;
  purpose: string;
  location: string;
  assetPrice: string;
  assetType: string;
  isForCompany: string;
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
      .test({
        name: 'ip_test',
        test: (value: string = '') => /^(\.\d\d\d$)|(\.\d\d)$/.test(value),
        message: 'The value you have entered is not a valid IP, use the format .72 or .192'
      })
      .required('Please fill out this field.'),
    assetType: string()
      .required('Please select a value'),
    macAddress: string()
      .when('assetType', (value, schema) => {
        if(value[0]?.toLocaleLowerCase() === 'other')
          return schema
            .required('Please fill out this field')
            .test({
              name: 'mac_address_test',
              test: (value: string = '') => /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value),
              message: 'The value you have entered is not a valid MAC address'
            });      
        return schema;
      }),
    assetPrice: string()
      .required('Please fill out this field.'),
    location: string()
      .required('Please fill out this field.'),
    purpose: string(),
    isForCompany: string(),
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
                assetType: '',
                assetPrice: '',
                purpose: '',
                location: '',
                isForCompany: '',
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
                      <Select
                        sx={{ width: { md: '48%', lg: '48%' }}}
                        label='Type' 
                        value={values.assetType} 
                        values={['Switch', 'Other']} 
                        onChange={(value) => {setFieldValue('assetType', value)}}
                        isError={Boolean(getFieldMeta('assetType').touched && errors.assetType)}
                        error={errors.assetType}
                      />
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="macAddress" label='MAC Address' />
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="location" label='Location' required />
                      <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="assetPrice" label='Price' required />
                      <TextField sx={{ width: { md: '100%', lg: '100%' }}} name="purpose" label='Purpose' />
                      <FormControl>
                        <FormLabel>Asset belongs to the company?</FormLabel>
                        <RadioGroup row>
                          <FormControlLabel label='Yes' control={<Radio value='yes' onChange={(e) => setFieldValue('isForCompany', e.target.value)}/>} />
                          <FormControlLabel label='No' control={<Radio value='no' onChange={(e) => setFieldValue('isForCompany', e.target.value)}/>} />
                        </RadioGroup>
                        { 
                          errors.isForCompany &&
                          <FormHelperText>Please select a value</FormHelperText>
                        }
                      </FormControl>    
                    </Box>
                    <Button variant='contained' type='submit' sx={{ margin: { xs: '1rem 0', md: '0.75rem 2rem'} }}>Register</Button>
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