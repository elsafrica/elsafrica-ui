'use client'
import React from 'react';
import Header from '@/app/components/Header';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import Table from '@/app/components/Table';
import { Row } from '@/app/types/data';

interface Column {
  id: 'name' | 'phone1' | 'phone2' | 'location' | 'ip' | 'created_at' | 'bill' | 'total_earnings' | 'status';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | 'left';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'name', label: 'Customer Name', minWidth: 170 },
  { id: 'phone1', label: 'Primary Phone', minWidth: 120, align: 'center' },
  { id: 'phone2', label: 'Secondary Phone', minWidth: 120, align: 'center' },
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
    id: 'created_at',
    label: 'Date Joined',
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
    phone2,
    location,
    ip,
    created_at: `${moment(created_at).year()}/${moment(created_at).month() + 1}/${moment(created_at).day()}`,
    bill: Number(bill),
    total_earnings: Number(total_earnings),
    status: Boolean(status),
  };
}

const rows = [
  createData('John Doe', '+254 06 562725', 'Arkansas', '192.165.72.16', '2010-01-01T05:06:07', '2000', '18000', 'Active'),
  createData('Jane Doe', '+254 06 562725', 'Arkansas', '192.165.72.16', '2010-05-01T05:06:07', '2000', '18000', 'Due'),
  createData('Marcus Lee', '+254 06 562725', 'Arkansas', '192.165.72.16', '2010-01-01T05:06:07', '2000', '18000', 'Active'),
  createData('Maeve Atkinson', '+254 06 562725', 'Arkansas', '192.165.72.16', '2010-01-01T05:06:07', '2000', '18000', 'Overdue'),
  createData('Bryce Ryder', '+254 06 562725', 'Arkansas', '192.165.72.16', '2010-01-01T05:06:07', '2000', '18000', 'Suspended'),
];

export default function CustomerAccounts() {
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
  );
}