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
  { id: 'name', label: 'Asset Name', minWidth: 120, align: 'left' },
  { id: 'user_name', label: 'Customer Name', minWidth: 120, align: 'left' },
  { id: 'mac_address', label: 'Mac Address', minWidth: 125, align: 'left' },
  {
    id: 'location',
    label: 'Location/Apartment',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'purpose',
    label: 'Purpose',
    minWidth: 90,
    align: 'center',
  },
  {
    id: 'assetPrice',
    label: 'Price',
    minWidth: 90,
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
    id: 'isForCompany',
    label: 'Company Asset',
    minWidth: 20,
    align: 'center',
  },
  {
    id: 'created_at',
    label: 'Date Created',
    minWidth: 70,
    align: 'center',
  },
  { id: 'actions', label: 'Actions', minWidth: 40, align: 'center' },
];

function createData(
  userId: string,
  name: string,
  user_name: string,
  location: string,
  mac_address: string,
  created_at: string,
  purpose: string,
  isForCompany: string,
  assetPrice: string,
): Row {
  return { 
    userId,
    name,
    user_name,
    location,
    mac_address: mac_address || 'N/A',
    created_at: `${moment(created_at).format('MMM Do YYYY')}`,
    purpose,
    isForCompany: Boolean(isForCompany) ? 'Yes' : 'No',
    assetPrice,
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
		assets: Array<any>,
		dataLength: number,
    totalInvestment: number,
	}> => {
    const data = (await axios.get(`${BASE_URL}/assets/get`, {
			params: {
				pageNum: currentPage,
				rowsPerPage,
			}
    })).data;
		
		return data;
	}

	const { isLoading, isError, data } = useQuery({
		queryKey: [ 'assets', currentPage, rowsPerPage],
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

  const rows = data?.assets.map((asset) => createData(
    asset?._id,
    asset?.name, 
    asset?.belongs_to?.name,
    asset?.location,
    asset?.mac_address,
    asset?.createdAt,
    asset?.purpose,
    asset?.isForCompany,
    asset?.assetPrice,
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
          Customer Accounts
        </Typography>
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
        >
          <Typography
            component='p'
            fontWeight='bold'
            fontSize='1rem'
            color='Highlight'
            marginRight='0.75rem'
          >
            Total Investment
          </Typography>
          <Typography
            component='span'
            fontSize='0.75rem'
            fontWeight='medium'
            color='InfoText'
          >
            {new Intl.NumberFormat('en-US', {
              currency: 'KSH',
              minimumFractionDigits: 0,
              style: 'currency'
            }).format(data?.totalInvestment || 0)}
          </Typography>
        </Box>
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