'use client'
import React from 'react';
import Header from '@/app/components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import Table from '@/app/components/Table';
import { Column } from '@/app/types/data';

const columns: Column[] = [
  { id: 'name', label: 'Customer Name', minWidth: 170 },
  { id: 'phone1', label: 'Primary Phone', minWidth: 120, align: 'center' },
  {
    id: 'location',
    label: 'Location/Apartment',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'ip',
    label: 'IP Address',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'last_payment',
    label: 'Last Paid',
    minWidth: 100,
    align: 'center',
    format: (value: number) => `${moment(value).year()}-${moment(value).month() + 1}-${moment(value).date()}`,
  },
  {
    id: 'bill',
    label: 'Package',
    minWidth: 80,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'send_email',
    label: 'Send E-mail',
    minWidth: 120,
    align: 'center',
  },
  { id: 'ack_payment', label: 'Acknowledge Payment', minWidth: 160, align: 'center' },
  { id: 'isDisconnected', label: 'Disconnect', minWidth: 80, align: 'center' },
];

interface Data {
  userId: string,
  name: string;
  phone1: string;
  location: string;
  ip: string;
  last_payment: string;
  bill: number;
}

function createData(
  userId: string,
  name: string,
  phone1: string,
  location: string,
  ip: string,
  created_at: string,
  bill: string,
): Data {
  return { 
    userId,
    name,
    phone1,
    location,
    ip,
    last_payment: `${moment(created_at).year()}/${moment(created_at).month() + 1}/${moment(created_at).day()}`,
    bill: Number(bill),
  };
}

const rows = [
  createData('52', 'John Doe', '+254 06 562725', 'Arkansas', '192.165.72.16', '2010-01-01T05:06:07', '2000'),
  createData('53', 'Jane Doe', '+254 06 562725', 'Arkansas', '192.165.72.16', '2010-05-01T05:06:07', '2000'),
  createData('54', 'Marcus Lee', '+254 06 562725', 'Arkansas', '192.165.72.16', '2010-01-01T05:06:07', '2000'),
  createData('56', 'Maeve Atkinson', '+254 06 562725', 'Arkansas', '192.165.72.16', '2010-01-01T05:06:07', '2000'),
  createData('69', 'Bryce Ryder', '+254 06 562725', 'Arkansas', '192.165.72.16', '2010-01-01T05:06:07', '2000'),
];

function OverdueAccounts() {
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
      <Table columns={columns} rows={rows}/>
    </>
  )
}

export default OverdueAccounts