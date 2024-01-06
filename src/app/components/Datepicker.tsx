import * as React from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment, { Moment } from 'moment';
import { SxProps } from '@mui/material';

export default function CustomDatePicker({
  label,
  sx,
  currentValue,
  onChange
} : {
  label: string,
  currentValue: string | null,
  sx?: SxProps
  onChange: (value: Moment | null) => void
}) {
  const value = currentValue ? moment(currentValue) : null
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker value={value} sx={sx} slotProps={{ textField: { size: 'small' } }} label={label} onChange={onChange}/>
    </LocalizationProvider>
  );
}