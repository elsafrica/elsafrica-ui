import React, { ChangeEvent } from 'react'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import MuiSelect from '@mui/material/Select';

const Select = ({
  onChange,
  values,
  label,
  value,
  sx,
  error,
  isError,
} : {
  onChange: (value: string) => void,
  values: Array<string>,
  label: string,
  value: string,
  sx?: Object,
  error?: string,
  isError?: boolean
}) => {
  const menuItems = () => values.map((item) => <MenuItem value={item} key={item}>{item}</MenuItem>);
  return (
    <FormControl
      sx={{ width: 'auto', ...sx }}
      color={isError ? 'error' : 'primary'}
    >
      <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
      <MuiSelect
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        { menuItems() }
      </MuiSelect>
      { isError && <FormHelperText sx={{ color: '#d32f2f '}}>{error}</FormHelperText>}
    </FormControl>
  )
}

export default Select