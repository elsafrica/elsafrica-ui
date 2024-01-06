'use client'
import React, { useContext, useState } from 'react';
import Header from '@/app/components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
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
import Modal from '@/app/components/Modal';
import { colors } from '@mui/material';

type Item = { name: string, quantity: number, unit_cost: number };

type Invoice = {
  number: string,
  date: string,
  poNumber?: string,
  dueDate: string,
  to: string,
  items: Item[],
  notes?: string,
  terms?: string,
  tax?: number,
  discount?: number,
  shipping?: number
};

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
  { id: 'actions', label: 'Actions', minWidth: 30 }
];

function createData(
  userId: string,
  name: string,
  amount: number,
  created_at: string,
  user_name: string,
  invoice: Invoice
): Row {
  return { 
    userId,
    name,
    user_name,
    created_at: `${moment(created_at).format('MMM Do YYYY')}`,
    amount: Number(amount),
    invoice
  };
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

const currencyFormatter = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'Ksh',
  minimumFractionDigits: 0,
}).format(value);

export default function CustomerAccounts() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [notification, setNotification] = useState<Notification>();
  const [deleteId, setDeleteId] = useState<string>();
  const [modalData, setModalData] = useState<Invoice | undefined>();

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
		queryKey: [ 'invoice', currentPage, rowsPerPage],
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
    invoice
  )) || [];

  const onConfirmDelete = async () => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/invoice/delete/${deleteId}`);

      setNotification({
        status: 'success',
        message: data.msg
      });

      queryClient.invalidateQueries(['invoice']);
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
  const onCloseModal = () => setModalData(undefined);

  const subTotal = (items: Item[]) => items.reduce((acc: number, next: Item) => acc + (next.quantity * next.unit_cost), 0);

  const grandTotal = (items: Item[] = [], tax: number = 0, shipping: number = 0, discount: number = 0) => {
    const subtotal = subTotal(items);
    const totalTax = subtotal * (tax / 100);

    return (subtotal + totalTax + shipping) - discount;
  }

  const onRowClick = (data: Invoice) => setModalData(data);

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
        setDelete={onDelete}
        onRowClick={onRowClick}
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
      <Modal
        title='INVOICE'
        open={Boolean(modalData)}
        onClose={onCloseModal}
        fullWidth
        maxWidth='md'
      >
        <DialogContent>
          <Box
            display='flex'
            flexWrap='wrap'
          >
            <Box
              sx={{
                width: { xs: '100%', md: '50% '}
              }}
            >
              <Typography component='p'><b>Billed to:</b> {modalData?.to}</Typography>
            </Box>
            <Box
              display='flex'
              flexDirection='column'
              alignItems='flex-end'
              gap='0.5rem'
              sx={{
                width: { xs: '100%', md: '50% '}
              }}
            >
              <Typography component='p'><b>Invoice No:</b> {modalData?.number}</Typography>
              <Typography component='p'><b>Date Created:</b> {moment(modalData?.date).format('DD MMM YY')}</Typography>
              <Typography component='p'><b>Date Due:</b> {moment(modalData?.dueDate).format('DD MMM YY')}</Typography>
            </Box>

            <Box width='98%' margin='1rem 0'>
              <Box width='100%' margin='0 auto 0.5rem' display='flex' flexWrap='wrap' sx={{ backgroundColor: colors.blue[800], color: '#fff', borderRadius: '4px', padding: '4px 8px' }}>
                <Typography component='p' sx={{ width: '50%', margin: 0 }}>Item</Typography>
                <Typography component='p' sx={{ width: '20%', margin: 0 }}>Quantity</Typography>
                <Typography component='p' sx={{ width: '20%', margin: 0 }}>Unit Price</Typography>
                <Typography component='p' sx={{ width: '10%', margin: 0 }}>Total</Typography>
              </Box>

              {
                modalData?.items.map((item: Item, index: number) => (
                  <Box key={index} width='100%' margin='auto' display='flex' flexWrap='wrap' sx={{ padding: '4px 8px' }}>
                    <Typography component='p' sx={{ width: '50%', margin: 0 }}>{item.name}</Typography>
                    <Typography component='p' sx={{ width: '20%', margin: 0 }}>{item.quantity}</Typography>
                    <Typography component='p' sx={{ width: '20%', margin: 0 }}>{currencyFormatter(item.unit_cost)}</Typography>
                    <Typography component='p' sx={{ width: '10%', margin: 0 }}>{currencyFormatter(item.quantity * item.unit_cost)}</Typography>
                  </Box>
                ))
              }

              <Box
                display='flex'
                flexDirection='column'
                alignItems='flex-end'
                gap='0.2rem'
                marginTop='0.8rem'
              >
                <Typography component='span' fontSize='0.8rem' color='#f0590a'><b>Subtotal:</b> {currencyFormatter(subTotal(modalData?.items || []))}</Typography>
                <Typography component='span' fontSize='0.8rem' marginTop='0.5rem'><b>Discount:</b> {currencyFormatter(modalData?.discount || 0)}</Typography>
                <Typography component='span' fontSize='0.8rem'><b>Tax:</b> {currencyFormatter((modalData?.tax || 0) / 100 * subTotal(modalData?.items || []))}</Typography>
                <Typography component='span' fontSize='0.8rem'><b>Shipping:</b> {currencyFormatter((modalData?.shipping || 0))}</Typography>
                <Typography component='span' marginTop='0.5rem' color='#91d000'><b>Grand Total:</b> {currencyFormatter(grandTotal(modalData?.items, modalData?.tax, modalData?.shipping, modalData?.shipping))}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button color='error' type='button' onClick={onCloseModal}>Close</Button>
        </DialogActions>
      </Modal>
    </>
  );
}