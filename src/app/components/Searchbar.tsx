import React from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Close, Search } from '@mui/icons-material';

const Searchbar = ({
  label,
  value,
  onChange,
} : {
  label: string,
  value?: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}) => {
  return (
    <TextField
      id="search"
      value={value}
      onChange={onChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            { 
              value ? 
                <IconButton><Close /></IconButton>
                : <Search/>
            }
          </InputAdornment>
        ),
      }}
      label={label}
      variant='standard'
    />
  )
}

export default Searchbar