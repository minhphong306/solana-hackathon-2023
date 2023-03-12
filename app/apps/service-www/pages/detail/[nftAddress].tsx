import * as React from 'react';
import {useRouter} from 'next/router';
import {
  useAppContext,
  updateStateDialogListRentOut,
  updateStateDialogUpdateRentOut,
  updateStateloadingPage
} from '../../containers/AppContext';
import {gql, useMutation, useQuery} from '@apollo/client';
import {get} from 'dot-prop';
import Renting from '../../components/Layout/Renting';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import {LazyLoadImage} from 'react-lazy-load-image-component';
import Card from '../../components/Card/Card';
import {TIER_COLOR, TIER_NAME, TIER_ROBOT, TYPE_PART} from '../../utils/helpers/constants';
import requireUserLogin from "../../containers/Account/requireUserLogin";
import Button from "@mui/material/Button";
import RentOutListingModal from "../../containers/Renting/RentOutListingModal";
import RentOutUpdateModal from "../../containers/Renting/RentOutUpdateModal";
import moment from 'moment';

import getRentTransaction from '../../utils/instructions/rent';
import { useRentProgram } from '../../containers/RentProgramProvider';
import sendSignedTransaction from '../../utils/transactions/ sendSignedTransaction';
import { useConnection } from '@solana/wallet-adapter-react';
import { useSnackbar } from 'notistack';
import getClaimTransaction from 'apps/service-www/utils/instructions/getClaimTransaction';


const GET_ASSET_BY_NFT_ADDRESS = gql`
  query inventoryDetail($nft: String) {
    inventoryDetail(nft: $nft) {
      id
      nftAddress
      name
      image
      type
      tier
      image
      attributes
      price
      numberOfDay
      subtype
      description
      price
      isMyItem
      isListing
      owner
    }
    rentingHistory(nft: $nft) {
      type
      price
      numberOfDay
      ownerUserId
      rentUserId
      createdAt
    }
  }
`;

const RENT_RENTING_ASSET_MUTATION = gql`
  mutation rentRentingAsset($tx: String!, $nft: String!){
    rentRentingAsset(input:{
      tx: $tx,
      nft: $nft
    })
  }
`;

const CANCEL_RENTING_ASSET_MUTATION = gql`
  mutation cancelRentingAsset($tx: String!, $nftAddress: String!) {
    cancelRentingAsset(input:{
      tx: $tx,
      nft: $nftAddress
    })
  }
`;

export default function PartsPage() {
  const {state, dispatch} = useAppContext();
  const {enqueueSnackbar} = useSnackbar();
  const router = useRouter();
  const {nftAddress} = router.query;
  const {data, loading, error} = useQuery(GET_ASSET_BY_NFT_ADDRESS, {
    variables: {nft: nftAddress},
    fetchPolicy: 'network-only'
  });
  const [cancelRentingAsset] = useMutation(CANCEL_RENTING_ASSET_MUTATION);
  const [rentRentingAsset] = useMutation(RENT_RENTING_ASSET_MUTATION);
  const {connection} = useConnection();
  const {rentProgram} = useRentProgram();

  // if (error) {
  //   router.push('/');
  // }

  console.log(data, 'data detail');

  const baseAttributes = JSON.parse(get(data, 'inventoryDetail.attributes', '{}'));

  const history = get(data, 'rentingHistory', []);

  const listingRentOnclick = (e) => {
    e.preventDefault();
    dispatch(updateStateDialogListRentOut(true));
  };

  const updateRentOnclick = (e) => {
    e.preventDefault();
    dispatch(updateStateDialogUpdateRentOut(true));
  };

  const canclelistingOnclick = async (e) => {
    e.preventDefault();
    dispatch(updateStateloadingPage(true));
    try {
      const transaction = await getClaimTransaction(nftAddress as string,rentProgram);
      const signedTx = await rentProgram.provider.wallet.signTransaction(transaction);
      const {txid} = await sendSignedTransaction({
        connection: connection,
        signedTransaction: signedTx,
      });
      console.log(txid);
      await cancelRentingAsset({
        variables: {
          tx: txid,
          nftAddress: nftAddress
        },
        onCompleted: (data) => {
          enqueueSnackbar('Cancel successfully', {variant: 'success'});
        },
        refetchQueries: [
          'inventoryDetail'
        ]
      });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
    dispatch(updateStateloadingPage(false));
  };

  const rentOnclick = async (e) => {
    e.preventDefault();
    dispatch(updateStateloadingPage(true));
    try {
      const transaction = await getRentTransaction(nftAddress as string, '6zNhgoSkAWz81sy3fu8AwiKUqEScTkQVtbGCMFrxuD3T', rentProgram);
      const signedTx = await rentProgram.provider.wallet.signTransaction(transaction);
      const {txid} = await sendSignedTransaction({
        connection: connection,
        signedTransaction: signedTx,
      });
      console.log(txid);
      await rentRentingAsset({
        variables: {
          tx: txid,
          nft: nftAddress
        },
        onCompleted: (data) => {
          enqueueSnackbar('Rent successfully', {variant: 'success'});
        }
      });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
    }
    dispatch(updateStateloadingPage(false));
  };

  const typeNFT = get(data, 'inventoryDetail.type', 1);
  const tierNFT = get(data, 'inventoryDetail.tier', 1);
  const imageNFT = get(data, 'inventoryDetail.image', '');
  const numberOfDay = get(data, 'inventoryDetail.numberOfDay', 0);
  const isMyNft = get(data, 'inventoryDetail.isMyItem', false);
  const isListing = get(data, 'inventoryDetail.isListing', false);
  const owner = get(data, 'inventoryDetail.owner', '');

  return (
    <Renting
      childrent={
        <Box sx={{flexGrow: 1}}>
          {loading ? (
            <LinearProgress/>
          ) : (
            <>
              <Container
                sx={{
                  py: '2rem'
                }}
              >
                <Grid container spacing={2} columns={{xs: 1, lg: 2}}>
                  <Grid item xs={1}>
                    {typeNFT !== TYPE_PART.ROBOT && (<Box
                      component={'span'}
                      sx={{
                        backgroundColor: TIER_COLOR[tierNFT - 1],
                        color: 'white',
                        px: '0.5rem',
                        py: '0.2rem',
                        borderRadius: '0.3rem',
                      }}
                    >
                      {TIER_NAME[tierNFT - 1]}
                    </Box>)}
                    <Typography
                      variant="h4"
                      my={1}
                    >
                      {get(
                        data,
                        'inventoryDetail.name',
                        'Default name'
                      )}
                    </Typography>
                    <Typography
                      my={1}
                    >
                      Owner : <Typography component={'span'} color={'aqua'}>{owner}</Typography>
                    </Typography>
                    <Stack
                      direction={'row'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      mt={'-3rem'}
                    >
                      <LazyLoadImage
                        alt="part image"
                        src={imageNFT}
                        width="100%"
                        height="100%"
                        style={{objectFit: 'contain'}}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={1}>
                    {isMyNft ? (
                      isListing ? (
                        <Grid container spacing={2} columns={{xs: 1, lg: 4}}>
                          <Grid
                            item
                            xs={1}
                            lg={2.5}
                            display={'flex'}
                            direction={'column'}
                            justifyContent={'center'}
                            gap={1}>
                            <Typography>Rent: 11,000 BOT ($11.76)</Typography>
                            <Typography>Duration: {numberOfDay} Days</Typography>
                          </Grid>
                          <Grid
                            item xs={1}
                            lg={1.5}
                            display={'flex'}
                            direction={'column'}
                            alignItems={'center'}
                            gap={1}>
                            <Button
                              fullWidth
                              onClick={updateRentOnclick}
                              sx={{
                                border: '1px solid white',
                                bgcolor: '#F46D01',
                                color: 'white',
                                borderRadius: '1.4rem',
                                '&:hover': {
                                  bgcolor: '#e49353',
                                }
                              }}>Change</Button>
                            <Button
                              fullWidth
                              onClick={canclelistingOnclick}
                              sx={{
                                border: '1px solid white',
                                bgcolor: '#BD2A1A',
                                color: 'white',
                                borderRadius: '1.4rem',
                                '&:hover': {
                                  bgcolor: '#e49353',
                                }
                              }}>Cancel rental</Button>
                          </Grid>
                        </Grid>
                      ) : (
                        <Stack
                          direction={'row'}
                          justifyContent={'start'}
                          alignItems={'center'}
                          gap={1}>
                          <Button
                            onClick={listingRentOnclick}
                            sx={{
                              border: '1px solid white',
                              bgcolor: 'white',
                              color: '#5F0BF9',
                              borderRadius: '1.4rem',
                              px: '1rem',
                              '&:hover': {
                                bgcolor: '#e49353',
                              }
                            }}>Rent out</Button>
                        </Stack>
                      )
                    ) : (
                      <Grid container spacing={2} columns={{xs: 1, lg: 4}}>
                        <Grid
                          item
                          xs={1}
                          lg={2.5}
                          display={'flex'}
                          direction={'column'}
                          justifyContent={'center'}
                          gap={1}>
                          <Typography>Rent price: 11,000 BOT ($11.76)</Typography>
                          <Typography>Duration: {numberOfDay} Days</Typography>
                        </Grid>
                        {isListing && (
                          <Grid item xs={1} lg={1.5} display={'flex'} direction={'row'} alignItems={'center'} gap={1}>
                            <Button
                              onClick={rentOnclick}
                              sx={{
                                border: '1px solid white',
                                background: "linear-gradient(to right, #5D0AFA, #8F24EE)",
                                color: 'white',
                                borderRadius: '1.4rem',
                                px: '2rem',
                                '&:hover': {
                                  bgcolor: '#e49353',
                                }
                              }}>Rent</Button>
                          </Grid>
                        )}
                      </Grid>
                    )}

                    <Stack my={'2rem'} spacing={{xs: 1, md: 2}}>
                      <Typography variant="h6">About</Typography>
                      <Card sx={{p: {xs: '1rem', md: '1.5rem'}}}>
                        <Typography>
                          {get(
                            data,
                            'inventoryDetail.description',
                            null
                          )}
                        </Typography>
                      </Card>
                    </Stack>
                    <Stack spacing={{xs: 1, md: 2}}>
                      <Typography variant="h6">Stats</Typography>
                      <Card sx={{p: {xs: '1rem', md: '1.5rem'}}}>
                        <Grid
                          container
                          spacing={{xs: 1, md: 2}}
                          sx={{textAlign: 'center'}}
                        >
                          <Grid item xs={4}>
                            <Typography
                              sx={{fontWeight: 700, color: '#9D6EBC'}}
                            >
                              Damage
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              sx={{fontWeight: 700, color: '#9D6EBC'}}
                            >
                              HP
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography
                              sx={{fontWeight: 700, color: '#9D6EBC'}}
                            >
                              Power
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Stack
                              spacing={{xs: 1, md: 2}}
                              direction="row"
                              justifyContent="center"
                            >
                              <svg
                                width="32"
                                height="23"
                                viewBox="0 0 32 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.5 3.5C15.5 3 14.5 1 13.5 0H13.5002C18.0004 0 29.5 0 31 6.5C32.3491 12.3464 23.6667 19.3333 20 22C20 20.8333 19.4 17.9 19 17.5C18.6 17.1 12.3333 20.8333 9 22.5C9.83333 20.6667 11.4 16.8 11 16C10.6 15.2 3.5 15.6667 0 16C3 13.6667 8.6 10.1 9 8.5C9.4 6.9 5.83333 4.5 4.5 4C7 4.33333 11.7646 3.93386 13.5 3.5Z"
                                  fill="#A175C2"
                                />
                                <path
                                  d="M18.5 15.5L14 6.50006C18.3333 4.66673 30.0563 3.20181 28 7.99998C26.5 11.5 21.5 14.0001 18.5 15.5Z"
                                  fill="#241856"
                                />
                                <path
                                  d="M17.5 9.46192L16 6.96192C18 6.46192 23.5 5.7525 22.5 6.08604C21.3001 6.48627 19 7.58594 17.5 9.46192Z"
                                  fill="#A175C2"
                                />
                              </svg>
                              <Typography>
                                {get(baseAttributes, 'attack', 0)}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={4}>
                            <Stack
                              spacing={{xs: 1, md: 2}}
                              direction="row"
                              justifyContent="center"
                            >
                              <svg
                                width="29"
                                height="23"
                                viewBox="0 0 29 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14 5.5L6 0L0 4V14L14 23L29 14V4L22.5 0L14 5.5Z"
                                  fill="#A175C2"
                                />
                                <path
                                  d="M3 5L5 3.5L7 5L5 6.5V10L3 8.5V5Z"
                                  fill="#2B175C"
                                />
                              </svg>
                              <Typography>
                                {get(baseAttributes, 'health', 0)}
                              </Typography>
                            </Stack>
                          </Grid>
                          <Grid item xs={4}>
                            <Stack
                              spacing={{xs: 1, md: 2}}
                              direction="row"
                              justifyContent="center"
                            >
                              <svg
                                width="22"
                                height="30"
                                viewBox="0 0 22 30"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.5 17L15.5 0L10 13H21.5L5 30L10 17H0.5Z"
                                  fill="#A175C2"
                                />
                              </svg>
                              <Typography>
                                {get(baseAttributes, 'power', 0) ||
                                  get(baseAttributes, 'energy', 0)}
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Card>
                    </Stack>
                  </Grid>
                </Grid>
                <Typography variant="h6" my={'1rem'}>About</Typography>
                <Card sx={{
                  width: '100%'
                }}>
                  <>
                    <Grid container spacing={2} columns={{xs: 5}}>
                      <Grid item xs={1}>
                        EVENTS
                      </Grid>
                      <Grid item xs={1}>
                        PRICE
                      </Grid>
                      <Grid item xs={1}>
                        FROM
                      </Grid>
                      <Grid item xs={1}>
                        TO
                      </Grid>
                      <Grid item xs={1}>
                        DATE
                      </Grid>
                    </Grid>
                    {history.map((value, index) => (
                      <Grid key={`index-history-${index}`} container spacing={2} columns={{xs: 5}}>
                        <Grid item xs={1}>
                          <Box color={'aqua'}>
                            {get(value, 'type', '')}
                          </Box>
                        </Grid>
                        <Grid item xs={1}>
                          {get(value, 'price', 0)}
                        </Grid>
                        <Grid item xs={1}>
                          {get(value, 'ownerUserId', '')}
                        </Grid>
                        <Grid item xs={1}>
                          {get(value, 'rentUserId', '')}
                        </Grid>
                        <Grid item xs={1}>
                          <Box color={'gold'}>
                            {moment.unix(get(value, 'createdAt', 0)).format('DD/MM/YYYY h:mm:ss')}
                          </Box>
                        </Grid>
                      </Grid>
                    ))}
                  </>
                </Card>
              </Container>
              <RentOutListingModal
                name={
                  get(data,
                    'inventoryDetail.name',
                    'Default name'
                  )}
                nftAddress={
                  get(data,
                    'inventoryDetail.nftAddress',
                    'Default nftAddress'
                  )
                }
              />
              <RentOutUpdateModal
                name={
                  get(data,
                    'inventoryDetail.name',
                    'Default name'
                  )}
                nftAddress={
                  get(data,
                    'inventoryDetail.nftAddress',
                    'Default nftAddress'
                  )
                }
              />
            </>
          )}
        </Box>
      }
    >
    </Renting>
  );
}

export const getServerSideProps = requireUserLogin;
