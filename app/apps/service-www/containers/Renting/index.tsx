import * as React from 'react';
import {gql, useQuery} from '@apollo/client';
import {
  useAppContext,
} from '../AppContext';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Stack} from '@mui/material';
import {useSnackbar} from 'notistack';
import Grid from '@mui/material/Grid';
import {get} from 'dot-prop';
import {useWallet} from '@solana/wallet-adapter-react';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import isArray from "lodash/isArray";
import {LIMIT_PAGE, PartType} from "../Inventory/constants";
import {TIER_COLOR, TIER_NAME, TIER_ROBOT} from "../../utils/helpers/constants";
import Pagination from "@mui/material/Pagination";
import {useRouter} from "next/router";
import Link from 'next/link';
import {ORDER, SortByOptions, SortByPrice} from "./constants";
import SelectMenu from "../../components/SelectMenu";
import TextField from '@mui/material/TextField';

const GET_LIST_ITEMS_QUERY = gql`
  query rentingList(
    $tier:Int,
    $limit:Int,
    $page:Int,
    $order:String,
    $orderBy:Int,
    $search:String,
  ){
    rentingList (input:{
      tier:$tier,
      limit:$limit,
      page:$page,
      order:$order,
      orderBy:$orderBy,
      search:$search,
    }) {
      data {
        id
        nftAddress
        name
        image
        type
        tier
        image
        attributes
        price
        isMyItem
        numberOfDay
        isMyItem
        isListing
        subtype
      }
      total
    }
  }
`;

const RentingMain = () => {
  const {state, dispatch} = useAppContext();
  const {enqueueSnackbar} = useSnackbar();
  const {publicKey} = useWallet();
  const router = useRouter();
  const page = get(router, 'query.page', '1');
  const [sortByRarity, setSortByRarity] = React.useState<number>(0);
  const [sortByPrice, setSortByPrice] = React.useState<number>(0);
  const [typeOrder, setTypeOrder] = React.useState<string>(ORDER.DESC);
  const [inputSearch, setInpuSearch] = React.useState<string>('');
  const {loading, error, data, refetch} = useQuery(GET_LIST_ITEMS_QUERY, {
    variables: {
      limit: LIMIT_PAGE,
      page: parseInt(page),
      tier: sortByRarity,
      // order: typeOrder,
      // orderBy: sortByPrice == 0 ? 1 : 0,
      search: inputSearch
    }, fetchPolicy: 'network-only',
  });

  console.log('renlist', data);

  const handleChangePage = (event: React.MouseEvent<any>, value: number) => {
    event.preventDefault();
    router.push({
      pathname: '/Renting', query: {page: value},
    }, undefined, {shallow: true});
  };

  React.useEffect(() => {
    refetch({
      limit: LIMIT_PAGE,
      page: parseInt(page),
      tier: sortByRarity,
      // order: typeOrder,
      // orderBy: sortByPrice == 0 ? 1 : 0,
      search: inputSearch
    });
  }, [page, sortByRarity, sortByPrice, typeOrder,inputSearch]);

  const assets = get(data, 'rentingList.data', []);
  const total = get(data, 'rentingList.total', 0);
  return (
    <Box sx={{pl: '2rem', py: "1rem"}}>
      <Grid
        spacing={2}
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        pr="2rem"
      >
        <Grid item sm={12} lg={6}>
          <TextField
            fullWidth
            id="outlined-inputSearch-input"
            label="Search"
            type="text"
            value={inputSearch}
            onChange={(e) => setInpuSearch(e.target.value)}
            sx={{
              borderRadius: '0.6rem',
              backgroundColor: '#130C35',
              label: {
                color: 'white',
              },
              fieldset: {
                borderColor: '#675cab',
                borderRadius: '0.6rem',
              },
            }}
          />
        </Grid>
        <Grid item sm={4} lg={2}>
          <SelectMenu
            width={'100%'}
            options={SortByOptions}
            label="Sort by Rarity"
            selected={sortByRarity}
            onSelectChange={(idx) => {
              setSortByRarity(idx);
            }}
          />
        </Grid>
        {/*<Grid item sm={4} lg={2}>
          <SelectMenu
            width={'100%'}
            options={SortByPrice}
            label="Sort by Price"
            selected={sortByPrice}
            onSelectChange={(idx) => {
              setSortByPrice(idx);
              switch (idx) {
              case 0:
              case 2:
                setTypeOrder(ORDER.DESC);
                break;
              case 1:
                setTypeOrder(ORDER.ASC);
                break;
              }
            }}
          />
        </Grid>*/}
      </Grid>
      <Typography
        fontWeight={'Medium'}
        component="div"
        variant="h6"
        sx={{my: '1rem'}}
      >
        {total} Results
      </Typography>
      {loading ? (<Stack
        direction={'row'}
        justifyContent={'center'}
        alignContent={'center'}
        marginTop={'4rem'}
        pr={{
          xs: '1rem', md: '2rem',
        }}
      >
        <CircularProgress/>
      </Stack>) : (<>
        <Grid
          container
          justifyContent="center"
          spacing={{xs: 3}}
          columns={{md: 2, lg: 3, xl: 5}}
          pr={{
            xs: '1rem', md: '2rem',
          }}
        >
          {isArray(assets) && assets.length > 0 && assets.map((value, index) => (<Grid item xs={1} key={index}>
            <Link href={`/detail/${value.nftAddress}`} passHref>
              <Card
                sx={{
                  backgroundColor: '#221855', border: '1px solid #8a58b1', borderRadius: '0.6rem', minHeight: '17rem',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: '#b0b356'
                  },
                }}
              >
                <CardContent>
                  {value.type !== PartType.ROBOT && (<Box
                    component={'span'}
                    sx={{
                      backgroundColor: value.tier !== TIER_ROBOT ? TIER_COLOR[value.tier - 1] : '#5C4ABA',
                      color: 'white',
                      px: '0.5rem',
                      py: '0.2rem',
                      borderRadius: '0.3rem',
                    }}
                  >
                    {value.tier !== TIER_ROBOT ? TIER_NAME[value.tier - 1] : 'Robot'}
                  </Box>)}
                  <Typography
                    gutterBottom
                    variant="body1"
                    fontWeight={'bold'}
                    component="div"
                    fontSize={'0.96rem'}
                    height={{xl: '1rem'}}
                    sx={{my: '0.4rem'}}
                  >
                    {value.name}
                  </Typography>
                  <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <CardMedia
                      component="img"
                      image={value.image}
                      alt={value.name}
                      sx={{
                        my: '1rem', width: '14rem', height: '14rem',
                      }}
                    />
                  </Box>
                  {value.type === PartType.ROBOT ? ('') : (<Box sx={{flexGrow: 1}}>
                    <Grid container spacing={2} columns={{xs: 12}}>
                      {value.type === PartType.WEAPON && (<Grid item xs={6}>
                        <Box sx={{display: 'flex', gap: '0.5rem'}}>
                          <CardMedia
                            component="img"
                            image="/service-www/icon/bullet.png"
                            alt="bullet"
                            sx={{width: '2rem'}}
                          />
                          <Box>
                            {JSON.parse(value.attributes).attack ? JSON.parse(value.attributes).attack : 0}
                          </Box>
                        </Box>
                      </Grid>)}
                      {value.type !== PartType.WEAPON && (<Grid item xs={6}>
                        <Box sx={{display: 'flex', gap: '0.5rem'}}>
                          <CardMedia
                            component="img"
                            image="/service-www/icon/health.png"
                            alt="health"
                            sx={{width: '2rem'}}
                          />
                          <Box>
                            {JSON.parse(value.attributes).health ? JSON.parse(value.attributes).health : 0}
                          </Box>
                        </Box>
                      </Grid>)}
                      {value.type !== PartType.WHEEL && (<Grid item xs={6}>
                        <Box sx={{display: 'flex', gap: '0.5rem'}}>
                          <CardMedia
                            component="img"
                            image="/service-www/icon/energy.png"
                            alt="energy"
                            sx={{width: '2rem'}}
                          />
                          <Box>
                            {value.type === PartType.BODY ? JSON.parse(value.attributes).energy : JSON.parse(value.attributes).power}
                          </Box>
                        </Box>
                      </Grid>)}
                    </Grid>
                  </Box>)}
                  <Stack
                    direction={'row'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    gap={2}
                    sx={{
                      borderRadius: '1.5rem',
                      textTransform: 'none',
                      background:
                        'linear-gradient(white,white) padding-box, linear-gradient(to right, #BC34FF 50%, #6582BE 76.52%) border-box',
                      border: '2px solid transparent',
                      color: '#BC34FF',
                      mt: 1,
                      p: '0.3rem'
                    }}
                  >
                    <Stack
                      direction={'row'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      gap={1}
                    >
                      <CardMedia
                        component="img"
                        image="/service-www/icon/bot.png"
                        alt="bot"
                        sx={{width: '1.4rem'}}
                      />
                      <Box>
                        {get(value, 'price', 0)}
                      </Box>
                    </Stack>
                    <Typography color={'black'}>
                      {get(value, 'numberOfDay', 0)}{' '}days
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          </Grid>))}
          {isArray(assets) && assets.length === 0 && (<Typography
            variant={'h3'}
            mt={'8rem'}
            pr={'2rem'}
            fontWeight={'bold'}
            sx={{
              fontSize: {
                sm: '2rem', lg: '3rem',
              },
            }}
          >
            NO RESULT
          </Typography>)}
        </Grid>
        <Stack
          spacing={2}
          sx={{my: '1rem'}}
          pr={'2rem'}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Pagination
            hidden={total > 20 ? false : true}
            count={Math.ceil(total / 20)}
            onChange={handleChangePage}
            color="secondary"
            page={parseInt(page)}
          />
        </Stack>
      </>)}
    </Box>
  );
};

export default RentingMain;
