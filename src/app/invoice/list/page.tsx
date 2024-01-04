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
import ConfrimBox from '@/app/components/ConfirmBox';
import { Context } from '@/app/providers/context';
import { useAuthorize } from '@/app/helpers/useAuth';
import AxiosInstance  from '@/app/services/axios';
import Loader from '@/app/components/Loader';

const columns: Column[] = [
  { id: 'name', label: 'Invoice Number', minWidth: 120, align: 'left' },
  { id: 'user_name', label: 'Customer Name', minWidth: 120, align: 'left' },
  {
    id: 'created_at',
    label: 'Date Created',
    minWidth: 70,
    align: 'center',
  },
  { 
    id: 'amount',
    label: 'Amount',
    minWidth: 70,
    align: 'left',
    format(value) {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'Ksh',
        minimumFractionDigits: 0,
      });

      return formatter.format(value)
    }
  },
];

function createData(
  userId: string,
  name: string,
  amount: number,
  created_at: string,
  user_name: string,
): Row {
  return { 
    userId,
    name,
    user_name,
    created_at: `${moment(created_at).format('MMM Do YYYY')}`,
    amount: Number(amount),
  };
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function CustomerAccounts() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [notification, setNotification] = useState<Notification>();
  const [deleteId, setDeleteId] = useState<string>();

  const queryClient = useQueryClient();
  const { authToken } = useContext(Context);
  const { isAuthorized } = useAuthorize(authToken);
  const axios = AxiosInstance.initInstance(authToken);

  const fetchInvoices = async (currentPage: number, rowsPerPage: number) : Promise<{
		invoices: Array<any>,
		dataLength: number,
	}> => {
    const data = (await axios.get(`${BASE_URL}/invoice/get`, {
			params: {
				pageNum: currentPage,
				rowsPerPage,
			}
    })).data;
		
		return data;
	}

	const { isLoading, isError, data } = useQuery({
		queryKey: [ 'assets', currentPage, rowsPerPage],
		queryFn: () => fetchInvoices(currentPage, rowsPerPage),
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

  const subtotal = (items: Array<any>) => (items?.reduce((prev, item) => prev + ((item.quantity || 0) * (item.unit_cost || 0)), 0) || 0);
	const taxTotal = (tax: number) => (tax || 0) / 100;
	const grandtotal = (tax: number, items: Array<any>, shipping: number, discount: number) => ((taxTotal(tax) * subtotal(items)) + (shipping || 0) + (subtotal(items) || 0) - (discount || 0));

  const rows = data?.invoices.map((invoice) => createData(
    invoice?._id,
    invoice?.number,
    grandtotal(invoice?.tax, invoice?.items, invoice?.shipping, invoice?.discount),
    invoice?.createdAt,
    invoice?.to,
  )) || [];

  const onConfirmDelete = async () => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/assets/delete/${deleteId}`);

      setNotification({
        status: 'success',
        message: data.msg
      });

      queryClient.invalidateQueries(['assets']);
    } catch (error: any) {
      if(error?.response) {
        setNotification({
          status: 'error',
          message: error.response.data.msg
        });
      }

      setNotification({
        status: 'error',
        message: error?.message
      });
    } finally {
      setDeleteId(undefined);
    }
  }

  const handleNotificationClose = () => setNotification(undefined);

  const onDelete = (id: string) => setDeleteId(id);
  const onCloseConfirm = () => setDeleteId(undefined);

  if(!isAuthorized) return <Loader />;

  return (
    <>
      <Header />
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        paddingRight='2rem'
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
          Invoices
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
      />
      <ConfrimBox
        title='Delete asset'
        open={Boolean(deleteId)}
        onClose={onCloseConfirm}
        onConfirm={onConfirmDelete}
      >
        Are you sure you want to proceed with deleting this item?
      </ConfrimBox>
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