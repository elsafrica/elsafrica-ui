'use client'
import React, { useState, useContext } from 'react';
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
import { useAuthorize } from '@/app/helpers/useAuth';
import Loader from '@/app/components/Loader';

const BASE_URL = process.env.REACT_APP_BASE_URL;

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
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'bill',
    label: 'Package',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'send_email',
    label: 'Send Message',
    minWidth: 80,
    align: 'center',
  },
  { id: 'ack_payment', label: 'Acknowledge Payment', minWidth: 80, align: 'center' },
];

function createData(
  userId: string,
  name: string,
  phone1: string,
  location: string,
  ip: string,
  last_payment: string,
  bill: string,
  isDisconnected: string,
): Row {
  return { 
    userId,
    name,
    phone1,
    location,
    ip,
    last_payment: `${moment(last_payment).format('MMM Do YYYY')}`,
    bill,
    isDisconnected,
  };
}

function SuspendedAccounts() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [notification, setNotification] = useState<Notification>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { authToken } = useContext(Context);
  const { isSuperUser } = useAuthorize(authToken);
  const axios = AxiosInstance.initInstance(authToken);

  const fetchCustomers = async (currentPage: number, rowsPerPage: number, searchValue?: string) : Promise<{
		users: Array<any>,
		dataLength: number,
	}> => {
		 const data = (await axios.get(`${BASE_URL}/accounts/suspended`, {
			params: {
				pageNum: currentPage,
				rowsPerPage,
        searchValue,
			}
		})).data;
		
		return data;
	}

	const { isLoading, isError, data } = useQuery({
		queryKey: [ 'suspended', currentPage, rowsPerPage, searchValue],
		queryFn: () => fetchCustomers(currentPage, rowsPerPage, searchValue),
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
    user?.ip,
    user?.last_payment,
    user?.bill?.package,
    user?.isDisconnected,
  )) || [];

  const sendMessage = async (id: string) => {
    setIsRequesting(true);

    try {
      const { status, data } = await axios.post(`${BASE_URL}/messages/send_message`, {
        id,
        status: 'suspended',
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
    } finally {
      setIsRequesting(false);
    }
  }

  const confirmPayment = async (id: string) => {
    setIsRequesting(true);

    try {
      const { status, data } = await axios.patch(`${BASE_URL}/customers/accept_payment`, {
        id,
        isSuspended: true,
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
      setIsRequesting(false);
      queryClient.invalidateQueries({ queryKey: ['suspended'] });
    }
  }

  const handleNotificationClose = () => setNotification(undefined);
  const onSearchChange = (value: string) => setSearchValue(value);

  if(!isSuperUser) return <Loader />;

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
          Suspended Accounts
        </Typography>
      </Box>
      <Table
        isLoading={isLoading}
        columns={columns}
        rows={rows}
        rowsPerPage={rowsPerPage}
        searchValue={searchValue}
        count={data?.dataLength || rows.length}
        isRequesting={isRequesting}
        setRowsPerPage={setRowsPerPage}
        page={currentPage}
        setPageNum={setCurrentPage}
        sendEmail={sendMessage}
        confirmPayment={confirmPayment}
        onSearchChange={onSearchChange}
      />
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

export default SuspendedAccounts