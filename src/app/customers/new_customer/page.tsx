'use client'
import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import { Formik, Form } from 'formik';
import TextField from '../../components/TextField';
import Button from '@mui/material/Button';
import { object, string } from 'yup';
import Header from '@/app/components/Header';
import Select from '@/app/components/Select';

const NewCustomer = () => {
  const validator = object({
    name: string()
      .required('Please fill out this field.'),
    phone1: string()
      .required('Please fill out this field.'),
    phone2: string()
      .required('Please fill out this field.'),
    ip: string()
      .required('Please fill out this field.'),
    location: string()
      .required('Please fill out this field.'),
    package: string()
      .required('Please fill out this field.'),
  });

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
            maxWidth: { md: '80%', xl: '80%' },
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
                name: '',
                phone1: '',
                phone2: '',
                location: '',
                ip: '',
                package: ''
              }}
              validationSchema={validator}
              onSubmit={() => {}}
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
                      <TextField sx={{ width: { md: '45%', lg: '30%' }}} name="name" label='Customer name' required />
                      <TextField sx={{ width: { md: '45%', lg: '30%' }}} name="phone1" label='Primary Phone' required />
                      <TextField sx={{ width: { md: '45%', lg: '30%' }}} name="phone2" label='Secondary Phone' required />
                      <TextField sx={{ width: { md: '45%', lg: '30%' }}} name="location" label='Location/Apartment' required />
                      <TextField sx={{ width: { md: '45%', lg: '30%' }}} name="ip" label='IP Address' required />
                      <Select
                        sx={{ width: { md: '45%', lg: '30%' }}}
                        label='Package' 
                        value={values.package} 
                        values={['Basic', 'Silver', 'Gold', 'Platinum']} 
                        onChange={(value) => {setFieldValue('package', value)}}
                        isError={Boolean(getFieldMeta('package') && errors.package)}
                        error={errors.package}
                      />
                    </Box>
                    <Button variant='contained' type='submit' sx={{ margin: { xs: '1rem 0', md: '0 2rem'} }}>Onboard Customer</Button>
                  </Form>
                )
              }
            </Formik>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default NewCustomer;