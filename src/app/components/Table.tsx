import React, { SetStateAction, Dispatch } from 'react'
import Paper from '@mui/material/Paper';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import { Column, Row } from '../types/data';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Table = ({
  columns,
  rows,
  page,
  noOfPages,
  rowsPerPage,
  isLoading,
  setRowsPerPage,
  setPageNum,
  sendEmail,
  activate,
  confirmPayment,
  setDelete,
  update,
} : {
  columns: Array<Column>
  rows: Array<Row>,
  page: number,
  noOfPages?: number,
  rowsPerPage: number,
  isLoading: boolean,
  setRowsPerPage: Dispatch<SetStateAction<number>>,
  setPageNum: Dispatch<SetStateAction<number>>,
  sendEmail?: (id: string) => void,
  activate?: (id: string, switchValue: boolean) => void,
  confirmPayment?: (id: string) => void,
  setDelete?: (id: string) => void,
  update?: (data?: Row) => void
}) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    setPageNum(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPageNum(0);
  };

  const chipVariant = (status: string | number | boolean | undefined) => {
    switch(status) {
      case 'Active':
        return 'success';
      case 'Due':
        return 'secondary';
      case 'Overdue':
        return 'warning';
      case'Suspended':
        return 'error';
    }
  }

  const renderRowCell = (column: Column, value: (number | string | boolean | undefined), data?: Row) => {
    const switchValue = Boolean(value)

    switch(column.id) {
      case 'status':
        return <Chip label={value} sx={{ width: '100%' }} color={chipVariant(value)}/>
      case 'total_earnings':
        return column.format && column.format(Number(value))
      case 'ack_payment':
        return <Button variant='contained' sx={{ fontSize: '0.7rem' }} color='success' onClick={() =>{ if(confirmPayment) confirmPayment(data?.userId || '') }}>Confirm Payment</Button>
      case 'send_email':
        return <Button variant='contained' sx={{ fontSize: '0.7rem' }} color='secondary' onClick={() => { if(sendEmail) sendEmail(data?.userId || '')}}>Send E-mail</Button>
      case 'isDisconnected':
        return <Switch color='error' onClick={() => { if(activate) activate(data?.userId || '', !switchValue) }} checked={switchValue} onChange={() => {}} />
      case 'actions':
        return (
          <Box>
            { 
              typeof update === 'function' &&
              <IconButton onClick={() => {update(data)}}>
                <EditIcon sx={{ fontSize: '1.2rem' }} color='info'/>
              </IconButton>
            }
            {
              typeof setDelete === 'function' &&
              <IconButton onClick={() => {setDelete(data?.userId || '')}}>
                <DeleteIcon sx={{ fontSize: '1.2rem' }} color='error'/>
              </IconButton>
            }
          </Box>
        )
      default:
        return value
    }
  }

  if (isLoading) {
    return (
      <Paper sx={{ 
        width: '95%', 
        overflow: 'hidden', 
        margin: '1rem auto', 
        padding: '2rem 0',
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center' }} elevation={5}>
        <CircularProgress />
      </Paper>
    )
  }

  if (rows.length < 1) {
    return (
      <Paper sx={{ 
        width: '95%', 
        overflow: 'hidden', 
        margin: '1rem auto', 
        padding: '2rem 0',
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center' }} elevation={5}>
        <Typography component="p" fontWeight="bold">
          No content available
        </Typography>
      </Paper>
    )
  }
  
  return (
    <Paper sx={{ width: '95%', overflow: 'hidden', margin: '1rem auto' }} elevation={5}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ fontWeight: 'bold', width: column?.width || 'auto', py: '1rem' }}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
            .map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {renderRowCell(column, value, row)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
          })}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default Table