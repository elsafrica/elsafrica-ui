import * as React from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import { grey, lightGreen } from '@mui/material/colors';

export default function Textarea({
  placeholder = 'Enter text',
  className,
  onChange,
  style
} : {
  onChange: (value: string) => void,
  placeholder?: string,
  style?: React.CSSProperties,
  className?: string,
}) {

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value);

  return <TextareaAutosize className={`textarea ${className}`} aria-label="empty textarea" onChange={onTextAreaChange} placeholder={placeholder} style={{ ...style }}/>;
}

