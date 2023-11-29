'use client'
import React, { useContext, useState } from 'react';
import { AxiosError } from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import Header from '@/app/components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import moment from 'moment';
import Table from '@/app/components/Table';
import { AxiosErrorData, Column, Row } from '@/app/types/data';
import { Notification } from '@/app/types/notification';
import { Context } from '@/app/providers/context';
import AxiosInstance  from '@/app/services/axios';
import Loader from '@/app/components/Loader';
import { useAuthorize } from '@/app/helpers/useAuth';
import Modal from '@/app/components/Modal';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@/app/components/TextField';
import Collapse from '@mui/material/Collapse';
import { Form, Formik, FormikHelpers } from 'formik';
import { boolean, number, object } from 'yup';

const BASE_URL = process.env.REACT_APP_BASE_URL;

interface FormikValues {
  amount: string;
  toggleTextField: boolean;
}

const columns: Column[] = [
  { id: 'name', label: 'Customer Name', minWidth: 120 },
  { id: 'phone1', label: 'Primary Phone', minWidth: 120, align: 'center' },
  {
    id: 'location',
    label: 'Location/Apartment',
    minWidth: 120,
    align: 'center',
  },
  {
    id: 'ip',
    label: 'IP Address',
    minWidth: 90,
    align: 'center',
  },
  {
    id: 'last_payment',
    label: 'Last Paid',
    minWidth: 70,
    align: 'center',
  },
  {
    id: 'amount',
    label: 'Amount Due',
    minWidth: 80,
    align: 'center',
    format(value: number) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'Ksh',
        minimumFractionDigits: 0,
      });

      return formatter.format(value)
    },
  },
  {
    id: 'send_email',
    label: 'Send Message',
    minWidth: 150,
    align: 'center',
  },
  { id: 'ack_payment', label: 'Acknowledge Payment', minWidth: 160, align: 'center' },
  { id: 'isDisconnected', label: 'Disconnect', minWidth: 40, align: 'center' },
];

function createData(
  userId: string,
  name: string,
  phone1: string,
  location: string,
  accrued_amount: string,
  ip: string,
  last_payment: string,
  bill: string,
): Row {
  return { 
    userId,
    name,
    phone1,
    location,
    amount: Number(accrued_amount),
    ip,
    last_payment: `${moment(last_payment).format('MMM Do YYYY')}`,
    bill,
  };
}

function AccruedAccounts() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [notification, setNotification] = useState<Notification>();
  const [userId, setUserId] = useState<string>();

  const queryClient = useQueryClient();
  const { authToken } = useContext(Context);
  const { isAuthorized } = useAuthorize(authToken);
  const axios = AxiosInstance.initInstance(authToken);

  const fetchCustomers = async (currentPage: number, rowsPerPage: number) : Promise<{
		users: Array<any>,
		dataLength: number,
	}> => {
		 const data = (await axios.get(`${BASE_URL}/accounts/accrued`, {
			params: {
				pageNum: currentPage,
				rowsPerPage,
			}
		})).data;
		
		return data;
	}

	const { isLoading, isError, data } = useQuery({
		queryKey: [ 'accrued', currentPage, rowsPerPage],
		queryFn: () => fetchCustomers(currentPage, rowsPerPage),
    onError: (error: AxiosError<AxiosErrorData>) => {
      if (error.response) {
        setNotification({
          status: 'error',
          message: error.response.data.msg
        });
      }

      setNotification({
        status: 'error',
        message: error.message
      });
    }
	});

  const rows = data?.users.map((user) => createData(
    user?._id,
    user?.name, 
    user?.phone1,
    user?.location,
    user?.accrued_amount,
    user?.ip,
    user?.last_payment,
    user?.bill?.package,
  )) || [];

  const sendMessage = async (id: string) => {
    try {
      const { status, data } = await axios.post(`${BASE_URL}/messages/send_message`, {
        id,
        status: 'accrued',
      });

      setNotification({
        status: 'success',
        message: data.msg
      });
    } catch (error: any) {
      if (error.response) {
        return setNotification({
          status: 'error',
          message: error.response.data.errMsg || error.response.data.err
        })
      }

      setNotification({
        status: 'error',
        message: error.message,
      });
    }
  }

  const setId = (id: string) => setUserId(id);

  const handleNotificationClose = () => setNotification(undefined);

  const activate = async (id: string, activationFlag: boolean) => {
    try {
      const { status, data } = await axios.patch(`${BASE_URL}/customers/activate`, {
        id,
        deactivate: activationFlag
      });

      setNotification({
        status: 'success',
        message: data.msg
      });

    } catch (error: any) {
      if (error.response) {
        return setNotification({
          status: 'error',
          message: error.response.data.msg,
        });
      }

      setNotification({
        status: 'error',
        message: error.message,
      });
    } finally {
      queryClient.invalidateQueries({ queryKey: ['accrued'] });
    }
  }

  const onCloseModal = () => setUserId(undefined);

  const onSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
    try {
      const { data } = await axios.patch(`${BASE_URL}/customers/deduct_accrued_debt`, Object.assign(values, { id: userId }));
      setNotification({
        status: 'success',
        message: data.msg
      });
      
      setId('');
      helpers.resetForm({
        values: {
          toggleTextField: false,
          amount: ''
        }
      });
    } catch (error: any) {
      if (error.response) {
        return setNotification({
          status: 'error',
          message: error.response.data.msg,
        });
      }
      
      setNotification({
        status: 'error',
        message: error.message,
      });
    } finally {
      setUserId(undefined);
      queryClient.invalidateQueries(['accrued']);
    }
  }

  if(!isAuthorized) return <Loader />;

  return (
    <>
      <Header />
      <Box>
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
          Accrued Accounts
        </Typography>
      </Box>
      <Table
        isLoading={isLoading}
        columns={columns}
        rows={rows}
        rowsPerPage={rowsPerPage}
        count={data?.dataLength || rows.length}
        setRowsPerPage={setRowsPerPage}
        page={currentPage}
        setPageNum={setCurrentPage}
        sendEmail={sendMessage}
        confirmPayment={setId}
        activate={activate}
      />
      <Modal
        title='Update Customer'
        open={Boolean(userId)}
        onClose={onCloseModal}
      >
        <Formik
          initialValues={{
            toggleTextField: false,
            amount: '0',
          }}
          validationSchema={object({
            toggleTextField: boolean(),
            amount: number()
              .when('toggleTextField', (value, schema) => {
                if(value[0]) return schema.required('Please fill out the amount paid.');
                return schema;
              })
          })}
          onSubmit={onSubmit}
        >
          {
            ({ values, setFieldValue, errors }) => (
              <Form>
                <DialogContent>
                  <Box
                    display='flex'
                    sx={{
                      flexDirection: 'column',
                      margin: {
                        xs: 'auto -1rem',
                        md: 'auto'
                      },
                      flexWrap: { md: 'wrap' },
                      justifyContent: { md: 'space-between' }
                    }}
                  >
                    <FormControl>
                      <FormLabel>Is it a full payment?</FormLabel>
                      <RadioGroup row defaultValue='full'>
                        <FormControlLabel label='Full' control={<Radio value='full' onChange={(e) => setFieldValue('toggleTextField', false)}/>} />
                        <FormControlLabel label='Partial' control={<Radio value='partial' onChange={(e) => setFieldValue('toggleTextField', true)}/>} />
                      </RadioGroup>
                    </FormControl>
                    <Collapse in={values.toggleTextField}>
                      <TextField sx={{ width: '100%' }} name="amount" label='Custom Amount' />
                    </Collapse>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button color='error' type='button' onClick={onCloseModal}>Cancel</Button>
                  <Button color='info' type='submit'>Update</Button>
                </DialogActions>
              </Form>
            )
          }
        </Formik>
      </Modal>
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

export default AccruedAccounts