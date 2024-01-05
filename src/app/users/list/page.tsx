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
  { id: 'name', label: 'Name', minWidth: 120, align: 'left' },
  { id: 'email', label: 'E-mail', minWidth: 120, align: 'left' },
  { id: 'phone1', label: 'Phone', minWidth: 125, align: 'left' },
  { id: 'actions', label: 'Actions', minWidth: 40, align: 'center' },
  { id: 'isDisconnected', label: 'Disable', align: 'center'}
];

function createData(
  userId: string,
  name: string,
  email: string,
  phone1: string,
  userType: string,
  isDisconnected: string,
): Row {
  return { 
    userId,
    name,
    phone1,
    email,
    userType,
    isDisconnected,
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
  const { isSuperUser } = useAuthorize(authToken);
  const axios = AxiosInstance.initInstance(authToken);

  const fetchAssets = async (currentPage: number, rowsPerPage: number) : Promise<{
		users: Array<any>,
		dataLength: number,
	}> => {
    const data = (await axios.get(`${BASE_URL}/users/get`, {
			params: {
				pageNum: currentPage,
				rowsPerPage,
			}
    })).data;
		
		return data;
	}

	const { isLoading, isError, data } = useQuery({
		queryKey: ['users', currentPage, rowsPerPage],
		queryFn: () => fetchAssets(currentPage, rowsPerPage),
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

  const rows = data?.users.map((user) => createData(
    user?._id,
    user?.name, 
    user?.email,
    user?.phoneNo,
    user?.userType,
    user?.isActivated
  )) || [];

  const onConfirmDelete = async () => {
    try {
      const { data } = await axios.delete(`${BASE_URL}/users/delete/${deleteId}`);

      setNotification({
        status: 'success',
        message: data.msg
      });

      queryClient.invalidateQueries(['users']);
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

  const activate = async (id: string) => {
    try {
      const { status, data } = await axios.post(`${BASE_URL}/users/activate`, {
        id,
      });

      setNotification({
        status: 'success',
        message: data.msg
      });

      queryClient.invalidateQueries({ queryKey: ['users'] });
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
    }
  }

  const handleNotificationClose = () => setNotification(undefined);

  const onDelete = (id: string) => setDeleteId(id);
  const onCloseConfirm = () => setDeleteId(undefined);

  if(!isSuperUser) return <Loader />;

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
          Users
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
        activate={activate}
      />
      <ConfrimBox
        title='Delete User'
        open={Boolean(deleteId)}
        onClose={onCloseConfirm}
        onConfirm={onConfirmDelete}
      >
        Are you sure you want to proceed with deleting this user?
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