import React, { useCallback, useState } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Box from '@mui/material/Box'
import Upload from '@mui/icons-material/UploadFile'
import { useDropzone } from 'react-dropzone'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

const Dropzone = ({
  onSubmit,
} : {
  onSubmit: (file: File | undefined) => Promise<void>,
}) => {

  const [file, setFile] = useState<File>();
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
      console.log(acceptedFiles)
    },
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

export default Dropzone