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
import AxiosInstance  from '@/app/services/axios';
import { useQuery, useQueryClient } from 'react-query';
import { Notification } from '@/app/types/notification';
import ConfrimBox from '@/app/components/ConfirmBox';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button'
import Modal from '@/app/components/Modal';
import { Form, Formik, FormikHelpers } from 'formik';
import TextField from '@/app/components/TextField';
import { object, string } from 'yup';
import { Context } from '@/app/providers/context';
import { useAuthorize } from '@/app/helpers/useAuth';
import Loader from '@/app/components/Loader';

interface FormikValues extends Row {
  name: string;
  amount?: number;
}

const columns: Column[] = [
  { id: 'name', label: 'Package Name', minWidth: 120, width: '30%' },
  {
    id: 'amount',
    label: 'Amount',
    minWidth: 70,
    width: '30%',
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'created_at',
    label: 'Date Created',
    minWidth: 100,
    width: '30%',
    align: 'center',
  },
  { id: 'actions', label: 'Actions', minWidth: 80, align: 'center' },
];

function createData(
  userId: string, //This is the document id named as user id
  name: string,
  amount: number,
  created_at: string,
): Row {
  return { 
    userId,
    name,
    amount,
    created_at: `${moment(created_at).format('MMM Do YYYY')}`
  };
}

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function CustomerAccounts() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [notification, setNotification] = useState<Notification>();
  const [deleteId, setDeleteId] = useState<string>();
  const [update, setUpdate] = useState<FormikValues>();

  const queryClient = useQueryClient();
  const { authToken } = useContext(Context);
  const { isSuperUser } = useAuthorize(authToken);

  const axios = AxiosInstance.initInstance(authToken);

  const validator = object({
    amount: string()
      .required('Please fill out this field.'),
    name: string()
      .required('Please fill out this field.'),
  });

  const fetchPackages = async (currentPage: number, rowsPerPage: number) : Promise<{
		packages: Array<any>,
		dataLength: number,
	}> => {
		 const data = (await axios.get(`${BASE_URL}/packages/get`, {
			params: {
				pageNum: currentPage,
				rowsPerPage,
			}
		})).data;
		
		return data;
	}

	const { isLoading, isError, data } = useQuery({
		queryKey: [ 'packages', currentPage, rowsPerPage],
		queryFn: () => fetchPackages(currentPage, rowsPerPage),
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

  const rows = data?.packages.map((bill) => createData(
    bill?._id,
    bill?.name, 
    Number(bill?.amount),
    bill?.createdAt,
  )) || [];

  const handleNotificationClose = () => setNotification(undefined);

  const onConfirmDelete = async () => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/packages/delete/${deleteId}`);

      setNotification({
        status: 'success',
        message: data.msg
      });

      queryClient.invalidateQueries(['packages']);
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

  const onUpdateSubmit = async (values: FormikValues | undefined, helpers: FormikHelpers<FormikValues>) => {
    try {
      const { data } = await axios.patch(`${BASE_URL}/packages/update`, Object.assign({ id: update?.userId, ...values }));
      setNotification({
        status: 'success',
        message: data.msg
      });

      helpers.resetForm();
      queryClient.invalidateQueries(['packages']);
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

  const onDelete = (id: string) => setDeleteId(id);
  const onCloseConfirm = () => setDeleteId(undefined);

  const onUpdate = (data?: Row) => setUpdate(data);
  const onCloseUpdate = () => setUpdate(undefined);

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
          Package List
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
        update={onUpdate}
      />
      <ConfrimBox
        title='Delete package'
        open={Boolean(deleteId)}
        onClose={onCloseConfirm}
        onConfirm={onConfirmDelete}
      >
        Are you sure you want to proceed with deleting this item?
      </ConfrimBox>
      <Modal
        title='Update package'
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
            () => (
              <Form>
                <DialogContent>
                  <Box
                    display='flex'
                    sx={{
                      flexDirection: { xs: 'column', md: 'row' },
                      margin: 'auto',
                      flexWrap: { md: 'wrap' },
                      justifyContent: { md: 'space-between' }
                    }}
                  >
                    <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="name" label='Package Name' required />
                    <TextField sx={{ width: { md: '48%', lg: '48%' }}} name="amount" label='Amount' required />
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button color='error' type='button' onClick={onCloseUpdate}>Cancel</Button>
                  <Button color='info' type='submit'>Update Package</Button>
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