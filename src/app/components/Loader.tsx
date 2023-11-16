import React from 'react'
import Box from '@mui/material/Box'
import Progress from '@mui/material/CircularProgress'

const Loader = () => {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Progress />
    </Box>
  )
}

export default Loader