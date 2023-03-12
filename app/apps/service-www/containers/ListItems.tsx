import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchMenuContainer from '../components/SearchMenuContainer';

const ListItems = () => {

  return (
    <Box sx={{ flexGrow: 1, p: '1rem' }}>
      <SearchMenuContainer />
      <Typography
        fontWeight={'Medium'}
        component="div"
        variant="h6"
        sx={{ my: '1rem' }}
      >
        507,500 result
      </Typography>
      <Grid
        container
        justifyContent="center"
        spacing={{ xs: 3 }}
        columns={{ xs: 2, md: 4, lg: 5 }}
        sx={{ px: '4rem' }}
      >
        {Array.from(Array(12)).map((_, index) => (
          <Grid item xs={1} key={index}>
            <Card
              sx={{
                backgroundColor: '#221855',
                border: '1px solid #8a58b1',
                borderRadius: '0.6rem',
              }}
            >
              <CardContent>
                <Box
                  component={'span'}
                  sx={{
                    backgroundColor: '#f46d01',
                    color: 'white',
                    px: '0.5rem',
                    py: '0.2rem',
                    borderRadius: '0.3rem',
                  }}
                >
                  Legendary
                </Box>
                <Typography
                  gutterBottom
                  variant="body1"
                  fontWeight={'bold'}
                  component="div"
                  sx={{ my: '0.4rem' }}
                >
                  Light gun
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CardMedia
                    component="img"
                    image="/service-www/weapon/gun.png"
                    alt="green iguana"
                    sx={{
                      my: '1rem',
                      width: '12rem',
                    }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2} columns={{ xs: 12 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <CardMedia
                          component="img"
                          image="/service-www/icon/bullet.png"
                          alt="bullet"
                          sx={{ width: '2rem' }}
                        />
                        <Box>12</Box>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                        <CardMedia
                          component="img"
                          image="/service-www/icon/heart.png"
                          alt="bullet"
                          sx={{ width: '2rem' }}
                        />
                        <Box>102</Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
              <CardActions>
                <Box sx={{ display: 'flex', gap: '0.5rem', px: '0.5rem' }}>
                  <CardMedia
                    component="img"
                    image="/service-www/icon/bot.png"
                    alt="bullet"
                    sx={{ width: '1.6rem' }}
                  />
                  <Box>20.09 ($10)</Box>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListItems;
