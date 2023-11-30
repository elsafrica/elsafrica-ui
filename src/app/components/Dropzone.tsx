import React, { useCallback, useState } from 'react'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import Box from '@mui/material/Box'
import Upload from '@mui/icons-material/UploadFile'
import { Accept, useDropzone } from 'react-dropzone'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Fab, IconButton } from '@mui/material'
import { Close, InsertPhoto } from '@mui/icons-material'

const Dropzone = ({
  accept,
  onSubmit,
} : {
  accept: Accept,
  onSubmit: (file: File | undefined) => Promise<void>,
}) => {

  const [file, setFile] = useState<File>();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => setFile(acceptedFiles[0]),
    [],
  )
  
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    }
  });

  return (
    <Card sx={{ maxWidth: '400px', margin: 'auto' }}>
      <CardContent
        {...getRootProps()}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
      <input {...getInputProps()} />
        <Box flexDirection="column" display="flex" alignItems="center">
          <Upload color='action' fontSize='large'/>
          <Typography marginTop="1rem" color="text.secondary">
            Drag &rsquo;n&rsquo; Drop files here to upload
          </Typography>
          {
            file &&
            <Typography marginTop="1rem" color="text.secondary">
              You have selected { file.name }
            </Typography>
          }
        </Box>
      </CardContent>
      <CardActions>
        <Button type='button' size='small' onClick={() => onSubmit(file)}>Upload</Button>
      </CardActions>
    </Card>
  )
}

export const ImageDrop = ({
  accept,
  onAccept,
} : {
  accept: Accept,
  onAccept: (file: File | undefined) => void,
}) => {
  const [filePreview, setFilePreview] = useState<string>();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onAccept(acceptedFiles[0]);
      const reader = new FileReader();
      reader.readAsDataURL(acceptedFiles[0]);
      reader.onload = () => {
        setFilePreview(reader.result?.toString());
      };
    },
    [],
  )
  
  const { isDragActive, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept
  });

  const resetFile = () => {
    setFilePreview(undefined);
    onAccept(undefined);
  }

  return (
    <Card sx={{ maxWidth: '285px', margin: '1rem 0 0', width: '285px', minHeight: '100px', position: 'relative' }}>
      {
        filePreview &&
        <CardActionArea>
          <IconButton color='error' size='small' sx={{ position: 'absolute', right: '0.5rem', top: '0.5rem', zIndex: 999 }} onClick={resetFile}>
            <Close />
          </IconButton>
          <CardMedia
            component='img'
            image={filePreview}
            sx={{
              maxWidth: '100%'
            }}
          />
        </CardActionArea>
      }
      {
        !filePreview &&
        <CardContent {...getRootProps()} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <input {...getInputProps()} />
          <Box flexDirection="column" display="flex" alignItems="center">
            <InsertPhoto />
            <Typography marginTop="1rem" fontSize='0.75rem' color="text.secondary">
              Drag &rsquo;n&rsquo; Drop files here to upload
            </Typography>
          </Box>
        </CardContent>
      }
    </Card>
  )
}

export default Dropzone