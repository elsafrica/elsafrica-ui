'use client'
import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import { Formik, Form } from 'formik';
import TextField, { TextFieldPassword } from '../components/TextField';
import Button from '@mui/material/Button';
import { object, string } from 'yup';

const SignIn = () => {
  //Form validator
  const validator = object({
    username: string()
      .required('Username is required'),
    password: string()
      .required('Password is required'),
  });

  return (
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
              username: '',
              password: '',
            }}
            validationSchema={validator}
            onSubmit={() => {}}
          >
            {
              () => (
                <Form>
                  <Box
                    display='flex'
                    flexDirection='column'
                    paddingX='2rem'
                  >
                    <TextField name="username" label='Username' required />
                    <TextFieldPassword name="password" label='Password' required />
                    <Button variant='contained' type='submit' sx={{ backgroundColor: '#91d000', color: 'white', margin: '0.25rem 0' }}>Sign In</Button>
                  </Box>
                </Form>
              )
            }
          </Formik>
        </Box>
      </Box>
    </Box>
  );
}

export default SignIn;