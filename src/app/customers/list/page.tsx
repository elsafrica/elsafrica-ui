'use client'
import React, { useContext, useState } from 'react';
import Header from '@/app/components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import moment from 'moment';
import Table from '@/app/components/Table';
import { AxiosErrorData, Column, Row } from '@/app/types/data';
import { AxiosError } from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { Notification } from '@/app/types/notification';
import Modal from '@/app/components/Modal';
import { Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import { Button, CircularProgress, DialogActions, DialogContent } from '@mui/material';
import TextField, { TelTextField } from '@/app/components/TextField';
import Select from '@/app/components/Select';
import { Context } from '@/app/providers/context';
import AxiosInstance  from '@/app/services/axios';
import { useAuthorize } from '@/app/helpers/useAuth';
import Loader from '@/app/components/Loader';

const columns: Column[] = [
  { id: 'name', label: 'Customer Name', minWidth: 120, align: 'left' },
  { id: 'phone1', label: 'Primary Phone', minWidth: 100, align: 'left' },
  { id: 'phone2', label: 'Secondary Phone', minWidth: 100, align: 'left' },
  {
    id: 'location',
    label: 'Location/Apartment',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'ip',
    label: 'IP Address',
    minWidth: 90,
    align: 'center',
  },
  {
    id: 'created_at',
    label: 'Date Joined',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'bill',
    label: 'Package',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'amount',
    label: 'Package Amount',
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
    id: 'total_earnings',
    label: 'Total Earnings',
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
  { id: 'status', label: 'Status', minWidth: 80, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 40, align: 'center' },
];

function createData(
  userId: string,
  name: string,
  phone1: string,
  location: string,
  ip: string,
  created_at: string,
  bill: string,
  total_earnings: string,
  status: string,
  phone2?: string,
  email?: string,
  package_name?: string,
  amount?: string,
): Row {
  return { 
    userId,
    name,
    phone1,
    phone2: phone2 || 'N/A',
    location,
    ip,
    created_at: `${moment(created_at).format('MMM Do YYYY')}`,
    bill,
    total_earnings: Number(total_earnings),
    status,
    email,
    package_name,
    amount: Number(amount),
  };
}

interface FormikValues extends Row {
  firstName?: string;
  lastName?: string;
  phone1?: string;
  phone2?: string;
  location?: string;
  ip?: string;
  email?: string;
  customAmount?: string;
  package_name?: string;
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function CustomerAccounts() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [notification, setNotification] = useState<Notification>();
  const [update, setUpdate] = useState<FormikValues>();

  const { authToken } = useContext(Context);
  const { isAuthorized } = useAuthorize(authToken);

  const queryClient = useQueryClient();
  const axios = AxiosInstance.initInstance(authToken);

  const validator = object({
    firstName: string()
      .required('Please fill out this field.'),
    lastName: string()
      .required('Please fill out this field.'),
    phone1: string()
      .required('Please fill out this field.'),
    phone2: string(),
    email: string()
      .email('Please enter a valid e-mail.')
      .required('Please fill out this field.'),
    ip: string()
      .test({
        name: 'ip_address_test',
        test: (value: string | undefined) => /^(\.\d\d\d$)|(\.\d\d)$/.test(value || ''),
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

  const onUpdateSubmit = async (values: FormikValues, helpers: FormikHelpers<FormikValues>) => {
    try {
      const { data } = await axios.patch(`${BASE_URL}/customers/update`, Object.assign(values, { id: values.userId, package: values.package_name }));
      setNotification({
        status: 'success',
        message: data.msg
      });

      helpers.resetForm();
      queryClient.invalidateQueries(['customers']);
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
    } finally {
      setUpdate(undefined);
    }
  }

  const fetchCustomers = async (currentPage: number, rowsPerPage: number) : Promise<{
		users: Array<any>,
		dataLength: number,
	}> => {
		 const data = (await axios.get(`${BASE_URL}/customers/get_customers`, {
			params: {
				pageNum: currentPage,
				rowsPerPage,
			}
		})).data;
		
		return data;
	}

  const fetchPackages = async () : Promise<{
		packages: Array<any>,
	}> => {
		 const data = (await axios.get(`${BASE_URL}/packages/get`)).data;
		
		return data;
	}

	const { isLoading, isError, data } = useQuery({
		queryKey: [ 'customers', currentPage, rowsPerPage],
		queryFn: () => fetchCustomers(currentPage, rowsPerPage),
    onError(err: AxiosError<AxiosErrorData>) {
      if(err.response) {
        setNotification({
          status: 'error',
          message: err.response.data.msg
        });
      }

      setNotification({
        status: 'error',
        message: err.message
      });
    },
	});

  const { data: packages } = useQuery({
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

  const checkStatus = (last_payment?: string, isDisconnected?: boolean) : string => {
    const due = 
      moment(last_payment)
      .isSameOrBefore(moment(new Date())
      .subtract(30, 'days'));
    const overdue = 
      moment(last_payment)
      .isSameOrBefore(moment(new Date())
      .subtract(35, 'days'));

    if (isDisconnected) {
      return 'Suspended';
    }

    if (overdue) {
      return 'Overdue';
    }

    if (due) {
      return 'Due';
    }

    return 'Active';
  }

  const rows = data?.users.map((user) => createData(
    user?._id,
    user?.name, 
    user?.phone1,
    user?.location,
    user?.ip,
    user?.createdAt,
    user?.bill?.package,
    user?.total_earnings,
    checkStatus(user?.last_payment, user?.isDisconnected),
    user?.phone2,
    user?.email,
    user?.bill?.package,
    user?.bill?.amount,
  )) || [];

  const handleNotificationClose = () => setNotification(undefined);

  const onUpdate = (data?: Row) => {
    const names : string[] = data?.name.split(' ') || ['', ''];

    setUpdate({
      name: '',
      firstName: names[0],
      lastName: names[1],
      ...data
    })
  };

  const onCloseUpdate = () => setUpdate(undefined);

  if(!isAuthorized) {
    return (
      <Loader />
    )
  }

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
          Customer Accounts
        </Typography>
      </Box>
      <Table
        isLoading={isLoading}
        columns={columns}
        rows={rows}
        page={currentPage}
        count={data?.dataLength || rows.length}
        setPageNum={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        update={onUpdate}
      />
      <Modal
        title='Update Customer'
        open={Boolean(update)}
        onClose={onCloseUpdate}
      >
        <Formik
          initialValues={update || { name: '' }}
          validationSchema={validator}
          onSubmit={onUpdateSubmit}
          enableReinitialize
        >
          {
            ({ values, errors, getFieldMeta, setFieldValue }) => (
              <Form>
                <DialogContent>
                  <Box
                    display='flex'
                    sx={{
                      flexDirection: { xs: 'column', md: 'row' },
                      margin: {
                        xs: 'auto -1rem',
                        md: 'auto'
                      },
                      flexWrap: { md: 'wrap' },
                      justifyContent: { md: 'space-between' }
                    }}
                  >
                    <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="firstName" label='Customer First Name' required />
                    <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="lastName" label='Customer Last Name' required />
                    <TelTextField value={values.phone1} setFieldValue={setFieldValue} sx={{ width: { md: '48%', lg: '48%' }}} name="phone1" label='Primary Phone' required />
                    <TelTextField value={values.phone2} setFieldValue={setFieldValue} sx={{ width: { md: '48%', lg: '48%' }}} name="phone2" label='Secondary Phone' />
                    <TextField sx={{ width: { md: '100%', lg: '100%' }}} name="email" label='Email' required />
                    <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="location" label='Location/Apartment' required />
                    <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="ip" label='IP Address' required />
                    <Select
                      sx={{ width: { md: '48%', lg: '48%' }}}
                      label='Package' 
                      value={values.package_name || ''} 
                      values={packages?.packages?.concat([{ name: 'Custom'}]).map((item: { name: string, amount: string }) => item.name) || []} 
                      onChange={(value) => {setFieldValue('package_name', value)}}
                      isError={Boolean(getFieldMeta('package_name') && errors.package_name)}
                      error={errors.package_name}
                    />
                    { values.package_name === 'Custom' && <TextField sx={{ width: { md: '48%', lg: '48%' }, margin: { xs: '1rem 0 0', md: '0' }}} name="customAmount" label='Custom Amount' required />}
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button color='error' type='button' onClick={onCloseUpdate}>Cancel</Button>
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
  );
}