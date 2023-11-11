'use client'
import React, { useState } from 'react';
import Header from '@/app/components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import moment from 'moment';
import Table from '@/app/components/Table';
import { AxiosErrorData, Row } from '@/app/types/data';
import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { Notification } from '@/app/types/notification';

interface Column {
  id: 'name' | 'phone1' | 'phone2' | 'location' | 'ip' | 'created_at' | 'bill' | 'total_earnings' | 'status';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: 'Customer Name', minWidth: 120 },
  { id: 'phone1', label: 'Primary Phone', minWidth: 100, align: 'center' },
  { id: 'phone2', label: 'Secondary Phone', minWidth: 100, align: 'center' },
  {
    id: 'location',
    label: 'Location/Apartment',
    minWidth: 170,
    align: 'center',
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
    minWidth: 70,
    align: 'center',
    format: (value: number) => `${moment(value).year()}-${moment(value).month() + 1}-${moment(value).date()}`,
  },
  {
    id: 'bill',
    label: 'Package',
    minWidth: 80,
    align: 'center',
  },
  {
    id: 'total_earnings',
    label: 'Total Earnings',
    minWidth: 80,
    align: 'center',
    format: (value: number) => value.toFixed(2),
  },
  { id: 'status', label: 'Status', minWidth: 80, align: 'center' },
];

function createData(
  name: string,
  phone1: string,
  location: string,
  ip: string,
  created_at: string,
  bill: string,
  total_earnings: string,
  status: string,
  phone2?: string,
): Row {
  return { 
    name,
    phone1,
    phone2: phone2 || 'N/A',
    location,
    ip,
    created_at: `${moment(created_at).year()}/${moment(created_at).month() + 1}/${moment(created_at).day()}`,
    bill,
    total_earnings: Number(total_earnings),
    status,
  };
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function CustomerAccounts() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [notification, setNotification] = useState<Notification>()

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
    user?.name, 
    user?.phone1,
    user?.location,
    user?.ip,
    user?.createdAt,
    user?.bill?.amount,
    user?.total_earnings,
    checkStatus(user?.last_payment, user?.isDisconnected),
    user?.phone2,
  )) || [];

  const handleNotificationClose = () => setNotification(undefined);

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
        setPageNum={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
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
  );
}