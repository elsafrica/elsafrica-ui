import React, { useState } from 'react'
import MuiTextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import FieldHelperText from '@mui/material/FormHelperText'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Visibility from '@mui/icons-material/Visibility'

import { useField, FieldHookConfig } from 'formik'
import { MuiTelInput } from 'mui-tel-input'

interface FieldProps {
  name: string;
  label: string;
  required?: boolean;
  sx?: Object;
  setFieldValue?: (fieldName: string, value: string) => void;
  value?: string;
};

const TextField = (props : FieldHookConfig<string> & FieldProps) => {
  const [field, meta] = useField(props);
  return (
    <MuiTextField
      sx={{ marginBottom: '1rem', ...props.sx }}
      error={Boolean(meta.touched) && Boolean(meta.error)}
      label={props.label}
      required={Boolean(props.required)}
      helperText={meta.touched && meta.error}
      { ...field }
    />
  )
}

export const TelTextField = (props : FieldHookConfig<string> & FieldProps) => {
  const [field, meta] = useField(props);

  const updateValue = (value: string) => {
    if(props.setFieldValue) props.setFieldValue(props.name, value)
  };
  return (
    <MuiTelInput
      onlyCountries={['KE']}
      defaultCountry='KE'
      sx={{ marginBottom: '1rem', ...props.sx }}
      error={Boolean(meta.touched) && Boolean(meta.error)}
      label={props.label}
      required={Boolean(props.required)}
      helperText={meta.touched && meta.error}
      value={props.value}
      onChange={updateValue}
    />
  )
}

export const TextFieldPassword = (props: FieldHookConfig<string> & FieldProps) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  return (
    <FormControl sx={{ marginBottom: '1rem' }} variant="outlined" color={meta.error && meta.touched ? 'error' : 'primary'}>
      <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        sx={{
          width: 'auto',
          ...props.sx
        }}
        type={showPassword ? 'text' : 'password'}
        required={props.required}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleClickShowPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
        { ...field }
      />
      { meta.error && meta.touched && <FieldHelperText sx={{ color: '#d32f2f '}}>{meta.error}</FieldHelperText>}
    </FormControl>
  );
}

export default TextField;