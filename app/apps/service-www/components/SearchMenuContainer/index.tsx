import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import SearchBar from '../SearchBar';
import SearchMenu from '../SearchMenu';
import ViewOption from '../ViewOption';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const statusOptions = ['All', 'Common', 'Uncommon', 'Rare', 'Epic'];
const sortOptions = ['Default', 'Price: Low to High', 'Price: High to Low'];

export default function SearchMenuContainer() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1} columns={{ xs: 8, xl: 12 }}>
        <Grid item xs={0.5}>
          <IconButton aria-label="refresh">
            <CachedIcon fontSize={'large'} sx={{ color: 'primary.main' }} />
          </IconButton>
        </Grid>
        <Grid item xs={8.5}>
          <SearchBar />
        </Grid>
        <Grid item xs={2}>
          <SearchMenu option={sortOptions} name="Sort by" />
        </Grid>
        <Grid item xs={1}>
          <ViewOption />
        </Grid>
      </Grid>
    </Box>
  );
}
