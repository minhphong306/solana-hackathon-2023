import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';

export default function SearchBar() {
  return (
    <Box>
      <Paper
        component="form"
        sx={{
          p: '0.3rem',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.default',
          border: '1px solid ',
          borderColor: 'secondary.main',
          borderRadius: '0.6rem',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Items"
          inputProps={{ 'aria-label': 'search Items' }}
        />
        <IconButton
          type="submit"
          sx={{ p: '0.5rem', color: 'primary.main' }}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
