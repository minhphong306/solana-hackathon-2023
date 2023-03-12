import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { NftRobot } from '../../utils/types';
import TagBodyPart from '../Tag/TagBodyPart';
import { getURLImagePart } from '../../utils/helpers/various';
import Pagination from '../Pagination';

const ItemSkeleton = () => (
  <Grid item xs={1} key={`list-item-${0}`}>
    <Card
      sx={{
        backgroundColor: '#221855',
        border: '1px solid #8a58b1',
        borderRadius: '0.6rem',
      }}
    >
      <CardContent>
        <Skeleton variant="text" height={'2rem'} />
        <Skeleton variant="text" height={'2rem'} />
        <Skeleton
          variant="rectangular"
          height={'8rem'}
          sx={{ margin: '.5rem 0' }}
        />
        <Skeleton variant="text" height={'2rem'} />
        <Skeleton variant="text" height={'2rem'} />
      </CardContent>
    </Card>
  </Grid>
);
export interface ListItemsProps {
  items: NftRobot[];
  loading?: boolean;
}
const ListItems = ({ items, loading = false }: ListItemsProps) => {
  const perPage = 10;

  const [page, setPage] = useState(1);
  const [renderItems, setRenderItems] = useState<NftRobot[]>([]);

  useEffect(() => {
    const pageItems = items.filter((value, index) => {
      if (perPage * (page - 1) <= index && index < perPage * page) {
        return true;
      }
      return false;
    });
    setRenderItems(pageItems);
  }, [page, items]);

  useEffect(() => {
    setPage(1);
  }, [items]);

  const handleOnChange = (e, newPage) => {
    setPage(newPage);
  };

  const urlImages = items.map((nft) => getURLImagePart(nft));

  return (
    <>
      {loading ? (
        <Skeleton
          variant="text"
          height={'2rem'}
          width={'10rem'}
          sx={{ margin: '1rem 0' }}
        />
      ) : (
        <Typography
          sx={{ fontSize: '1.5rem', fontWeight: 600, margin: '1rem 0' }}
        >
          {items.length} Results
        </Typography>
      )}
      <Grid container spacing={{ xs: 3 }} columns={{ xs: 2, md: 4, lg: 5 }}>
        {loading
          ? [...Array(perPage)].map((v, i) => (
            <ItemSkeleton key={`list-item-${i}`} />
          ))
          : renderItems.map((_, index) => (
            <Grid item xs={1} key={`list-item-${index}`}>
              <Card
                sx={{
                  backgroundColor: '#221855',
                  border: '1px solid #8a58b1',
                  borderRadius: '0.6rem',
                }}
              >
                <CardContent>
                  <TagBodyPart type={_?.metadata.attributes[1]?.value} />
                  <Typography
                    gutterBottom
                    variant="body1"
                    fontWeight={'bold'}
                    sx={{
                      my: '0.4rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {_?.metadata.attributes[2]?.value}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CardMedia
                      component="img"
                      image={urlImages[index]}
                      alt="green iguana"
                      sx={{
                        my: '1rem',
                        width: '12rem',
                        height: '8rem',
                        objectFit: 'contain',
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
                <CardActions sx={{ pt: 0 }}>
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
      {items.length > perPage && (
        <Box
          sx={{
            margin: '2rem 0 3rem',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Pagination
            page={page}
            onPageChange={handleOnChange}
            count={Math.ceil(items.length / perPage)}
          />
        </Box>
      )}
    </>
  );
};

export default ListItems;
