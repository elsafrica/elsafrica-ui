import React from 'react'
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

const Table = ({
  columns,
  rows,
} : {
  columns: Array<Column>
  rows: Array<Row>
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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

  const renderRowCell = (column: Column, value: (number | string | boolean | undefined), userId?: string) => {
    const switchValue = column.id === 'isDisconnected' && value

    switch(column.id) {
      case 'status':
        return <Chip label={value} sx={{ width: '100%' }} color={chipVariant(value)}/>
      case 'bill':
          return column.format && column.format(Number(value))
      case 'total_earnings':
        return column.format && column.format(Number(value))
      case 'ack_payment':
        return <Button variant='contained' sx={{ fontSize: '0.7rem' }} color='primary' onClick={() => {}}>Confirm Payment</Button>
      case 'send_email':
        return <Button variant='contained' sx={{ fontSize: '0.7rem' }} color='secondary' onClick={() => {}}>Send E-mail</Button>
      case 'isDisconnected':
        return <Switch color='error' onClick={() => {}} value={switchValue} onChange={() => {}} />
      default:
        return value
    }
  }
  
  return (
    <Paper sx={{ width: '95%', overflow: 'hidden', margin: '1rem auto' }} elevation={8}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <MuiTable stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ fontWeight: 'bold' }}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {renderRowCell(column, value, row.userId)}
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