import * as React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import Tooltip from '@mui/material/Tooltip';
// import Modal from '@mui/material/Modal';
import {gql, useLazyQuery, useMutation, useQuery} from '@apollo/client';
import isArray from 'lodash/isArray';
import isEqual from 'lodash/isEqual';
import {
  TIER_NAME, TIER_COLOR, TIER_ROBOT,
} from '../../utils/helpers/constants';
import {useRouter} from 'next/router';
import LoadingButton from '@mui/lab/LoadingButton';
import {useSnackbar} from 'notistack';
import {get} from 'dot-prop';
import {
  TABS, LIMIT_PAGE, PartType, SortByOptions, // ViewOptions,
} from './constants';
import SelectMenu from '../../components/SelectMenu';
// import ViewOption from '../../components/ViewOption';
import {useUser} from '../../lib/Hooks';
import {
  useAppContext, updateIsSyncingState,
} from '../AppContext';
import LinkSetupAccount from '../../containers/Account/SetupAccountLinkModal';

const GET_LIST_ITEMS_QUERY = gql`
  query getListItems($limit: Int, $page: Int, $type: Int, $tier: Int) {
    assets(input: { limit: $limit, page: $page, tier: $tier, type: $type }) {
      id
      type
      nft
      tier
      name
      description
      attributes
      image
    }
    assetsAggregate(input: { type: $type, tier: $tier }) {
      totalCount
    }
  }
`;

const SYNC_ASSET_MUTATION = gql`
  mutation GetSyncAsset {
    syncAsset {
      success
      message
      timeRemaining
    }
  }
`;

const SYNC_STATUS_QUERY = gql`
  query SyncAssetStatus {
    syncAssetStatus {
      isDone
    }
  }
`;

const Inventory = () => {
  const {state, dispatch} = useAppContext();
  const checkUser = useUser();
  const router = useRouter();
  const page = get(router, 'query.page', '1');
  const [partType, setPartType] = React.useState<number>(PartType.BODY);
  const [sortBy, setSortBy] = React.useState<number>(0);
  // const [view, setView] = React.useState<number>(0);
  const {loading, error, data, refetch} = useQuery(GET_LIST_ITEMS_QUERY, {
    variables: {
      limit: LIMIT_PAGE, page: parseInt(page), type: partType, tier: sortBy,
    }, fetchPolicy: 'network-only',
  });

  const [syncAssetMutation] = useMutation(SYNC_ASSET_MUTATION);
  const {enqueueSnackbar} = useSnackbar();
  const [getSyncStatus] = useLazyQuery(SYNC_STATUS_QUERY);

  const handleChangePage = (event: React.MouseEvent<any>, value: number) => {
    event.preventDefault();
    router.push({
      pathname: '/profile/inventory', query: {page: value},
    }, undefined, {shallow: true});
  };
  const handleChangePartType = (event: React.MouseEvent<any>, newValue: number) => {
    event.preventDefault();
    setPartType(newValue);
  };

  const checkStatusSync = async () => {
    try {
      const checkingStatus = setInterval(async () => {
        const DataSyncStatus = await getSyncStatus();
        if (get(DataSyncStatus, 'data.syncAssetStatus.isDone', false)) {
          clearInterval(checkingStatus);
          refetch();
          dispatch(updateIsSyncingState(false));
          enqueueSnackbar('Sync success', {variant: 'success'});
        }
      }, 2000);
    } catch (error) {
      enqueueSnackbar(error.message, {variant: 'error'});
    }
  };

  const onClickSyncButton = async (event: React.MouseEvent<any>) => {
    event.preventDefault();
    await syncAssetMutation({
      onCompleted: (data) => {
        dispatch(updateIsSyncingState(true));
        enqueueSnackbar('Syncing...', {variant: 'success'});
      }, onError: (error) => {
        enqueueSnackbar(error.message, {variant: 'error'});
      },
    });
  };

  React.useEffect(() => {
    refetch({
      limit: LIMIT_PAGE, page: parseInt(page), type: partType, tier: partType === PartType.ROBOT ? 0 : sortBy,
    });
  }, [partType, page, sortBy]);

  React.useEffect(() => {
    if (state.isSyncing) {
      checkStatusSync();
    }
  }, [state.isSyncing]);

  const assets = get(data, 'assets', []);
  const total = get(data, 'assetsAggregate.totalCount', 0);
  return (<Box sx={{py: '1rem'}}>
    <LinkSetupAccount/>
    <Stack
      spacing={2}
      sx={{marginTop: '1rem'}}
      direction="row"
      justifyContent="start"
      alignItems="center"
    >
      <Typography component="h3" sx={{fontSize: '1.5rem', fontWeight: 700}}>
        Inventory
      </Typography>
      <LoadingButton
        variant="contained"
        loading={state.isSyncing}
        sx={{
          color: 'white', '& .MuiLoadingButton-loadingIndicator': {
            color: 'white',
          },
        }}
        onClick={onClickSyncButton}
      >
        Sync
      </LoadingButton>
      <Box
        hidden={!state.isSyncing}
        sx={{bgcolor: 'rebeccapurple', p: '0.5rem', borderRadius: '0.6rem'}}
      >
        Please wait, synchronizing data
      </Box>
    </Stack>
    <Divider sx={{borderColor: '#4A399F', my: '1rem'}}/>
    <Grid
      spacing={2}
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      pr="2rem"
    >
      <Grid item sm={8} lg={10}>
        <Tabs
          value={partType}
          onChange={handleChangePartType}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiButtonBase-root': {
              color: 'white', fontSize: {
                sm: 12, md: 14,
              }, pt: '0rem',
            }, '& .MuiButtonBase-root.Mui-selected': {
              color: 'white',
            }, '& .MuiTabs-indicator': {
              backgroundColor: '#BC34FF', borderRadius: '0.6rem', height: '4px',
            },
          }}
        >
          {TABS.map((value, index) => (<Tab
            key={`tabs-items-parts-${index}`}
            value={value.value}
            label={value.label}
          />))}
        </Tabs>
      </Grid>
      {partType !== PartType.ROBOT && (<Grid item sm={4} lg={2}>
        <SelectMenu
          width={'100%'}
          options={SortByOptions}
          label="Sort by"
          selected={sortBy}
          onSelectChange={(idx) => {
            setSortBy(idx);
          }}
        />
      </Grid>)}
      {/* <Grid item xs={2} mt={1}>
          <ViewOption view={view} setView={setView} />
        </Grid> */}
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
          <Card
            sx={{
              backgroundColor: '#221855', border: '1px solid #8a58b1', borderRadius: '0.6rem', minHeight: '17rem',
            }}
          >
            <CardContent>
              {partType !== PartType.ROBOT && (<Box
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
                {partType === PartType.ROBOT && !isEqual(get(JSON.parse(value.attributes), 'Owner', ''), '11111111111111111111111111111111') && (
                  <Typography
                    ml={'0.5rem'}
                    component="span"
                    sx={{
                      backgroundColor: '#F9440B',
                      fontSize: '0.875rem',
                      padding: '.1rem .375rem',
                      verticalAlign: 'middle',
                      borderRadius: '.375rem',
                    }}
                  >
                    Incomplete
                  </Typography>)}
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
              {!value.isMyItem &&
                <Box sx={{bgcolor: 'gold'}}>
                  Rented
                </Box>
              }
              {partType === PartType.ROBOT ? (<Button
                disabled={state.isSyncing}
                onClick={() => router.push(`/swap/${value.nft}`)}
                variant="outlined"
                fullWidth
                sx={{
                  background: 'linear-gradient(90deg, #5E0BF9 0%, #9527EC 100%);',
                  textTransform: 'capitalize',
                  borderRadius: '0.625rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  border: 'none',
                  color: 'white',
                  '&:hover': {
                    border: 'none',
                  },
                }}
              >
                Swap
              </Button>) : (<Box sx={{flexGrow: 1}}>
                <Grid container spacing={2} columns={{xs: 12}}>
                  {partType === PartType.WEAPON && (<Grid item xs={6}>
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
                  {partType !== PartType.WEAPON && (<Grid item xs={6}>
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
                  {partType !== PartType.WHEEL && (<Grid item xs={6}>
                    <Box sx={{display: 'flex', gap: '0.5rem'}}>
                      <CardMedia
                        component="img"
                        image="/service-www/icon/energy.png"
                        alt="energy"
                        sx={{width: '2rem'}}
                      />
                      <Box>
                        {partType === PartType.BODY ? JSON.parse(value.attributes).energy : JSON.parse(value.attributes).power}
                      </Box>
                    </Box>
                  </Grid>)}
                </Grid>
              </Box>)}
            </CardContent>
          </Card>
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
  </Box>);
};

export default Inventory;
