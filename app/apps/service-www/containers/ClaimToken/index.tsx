import * as React from 'react';
import {gql, useQuery} from '@apollo/client';
import {
  useAppContext,
  // updateStateloadingPage,
  updateStateDialogClaimToken,
  updateStateDialogWithdrawalToken,
  updateStateDialogDepositToken,
} from '../AppContext';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import {Stack} from '@mui/material';
import {useSnackbar} from 'notistack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import ClaimGearModal from './ClaimGearModal';
import WithdrawalGearModal from './WithdrawalGearModal';
import DepositGearModal from './DepositGearModal';
import LinkSetupAccount from '../../containers/Account/SetupAccountLinkModal';
import {get} from 'dot-prop';
import isEmpty from 'lodash/isEmpty';
import {useWallet} from '@solana/wallet-adapter-react';

const CLAIM_TOKEN_INFO = gql`
  query claimTokenInfo {
    walletDepositAddress {
      depositAddress
      tokenAddress
    }
    tokenAggregate {
      wallet {
        balance
      }
      reward {
        balance
        claimableAmount
      }
    }
    tokenConfig {
      minClaimDay
      claimFee
      withdrawFee
      minWithdrawAmount
    }
  }
`;

const ClaimToken = () => {
  const {state, dispatch} = useAppContext();
  const {enqueueSnackbar} = useSnackbar();
  const {publicKey} = useWallet();
  const [gear, setGear] = React.useState<number>(0);
  const [vGear, setVGear] = React.useState<number>(0);
  const [claimable, setClaimable] = React.useState<number>(0);
  const [minClaimDay, setMinClaimDay] = React.useState<number>(0);
  const [walletTransfer, setWalletTransfer] = React.useState<string>('');
  const [tokenCoin, setTokenCoin] = React.useState<string>('');
  const [feeClaim, setFeeClaim] = React.useState<number>(0);
  const [minQuantityTokenTransfer, setMinQuantityTokenTransfer] =
    React.useState<number>(0);
  const [feeWithdrawal, setFeeWithdrawal] = React.useState<number>(0);

  const {data: dataClaimTokenInfo, refetch: refetchClaimTokenInfo} = useQuery(
    CLAIM_TOKEN_INFO,
    {
      onError: (e) => {
        enqueueSnackbar(e.message, {
          variant: 'error',
        });
      },
    }
  );

  React.useEffect(() => {
    if (!isEmpty(dataClaimTokenInfo)) {
      setGear(get(dataClaimTokenInfo, 'tokenAggregate.wallet.balance', 0));
      setVGear(get(dataClaimTokenInfo, 'tokenAggregate.reward.balance', 0));
      setClaimable(
        get(dataClaimTokenInfo, 'tokenAggregate.reward.claimableAmount', 0)
      );

      setMinClaimDay(get(dataClaimTokenInfo, 'tokenConfig.minClaimDay', 0));
      setMinQuantityTokenTransfer(
        get(dataClaimTokenInfo, 'tokenConfig.minWithdrawAmount', 0)
      );
      setFeeClaim(get(dataClaimTokenInfo, 'tokenConfig.claimFee', 0));
      setFeeWithdrawal(get(dataClaimTokenInfo, 'tokenConfig.withdrawFee', 0));

      setWalletTransfer(
        get(dataClaimTokenInfo, 'walletDepositAddress.depositAddress', '')
      );
      setTokenCoin(
        get(dataClaimTokenInfo, 'walletDepositAddress.tokenAddress', '')
      );
    }
  }, [dataClaimTokenInfo]);

  React.useEffect(() => {
    refetchClaimTokenInfo();
  }, [
    state.profile.claimToken.dialogWithdrawalToken,
    state.profile.claimToken.dialogClaimToken,
    state.profile.claimToken.dialogDepositToken,
  ]);

  return (
    <Box sx={{py: '1rem'}}>
      <LinkSetupAccount/>
      <Typography
        component="h3"
        sx={{fontSize: '1.5rem', fontWeight: 700, mt: '1rem'}}
      >
        Deposit to gameplay
      </Typography>
      <Divider sx={{borderColor: '#4A399F', my: '1rem'}}/>
      <Box
        sx={{
          borderRadius: '0.6rem',
          bgcolor: '#6c48da',
          p: '1.5rem',
          width: '30rem',
        }}
      >
        <Chip
          sx={{
            bgcolor: '#6c48da',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            '& .MuiChip-avatar': {
              width: '2rem',
              height: '2rem',
            },
          }}
          avatar={
            <Avatar
              alt="icon_gear"
              src="/service-www/icon/icon_gear_mini.png"
              variant={'square'}
            ></Avatar>
          }
          label="Gear token"
        />
        <Box my={'1rem'}>
          <Divider sx={{borderColor: '#8971FE'}}/>
          <Divider sx={{borderColor: '#4A399F'}}/>
        </Box>
        <Typography fontSize={'2rem'} fontWeight={'bold'}>
          {gear} GEAR
        </Typography>
        <Typography mt={1} mb={2}>
          ~$0
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Tooltip
              title={`Login wallet please`}
              placement="top"
              open={isEmpty(publicKey) ? true : false}
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    fontSize: '0.8rem',
                    backgroundColor: 'white',
                    color: '#F46D01',
                  },
                },
                arrow: {
                  sx: {
                    '&::before': {
                      backgroundColor: 'white',
                    },
                  },
                },
              }}
            >
              <Button
                onClick={() => dispatch(updateStateDialogDepositToken(true))}
                disabled={!publicKey}
                fullWidth
                size={'large'}
                sx={{
                  textTransform: 'capitalize',
                  borderRadius: '0.6rem',
                  bgcolor: 'white',
                  fontWeight: 'bold',
                  color: '#6552C4',
                  '&:hover': {
                    bgcolor: '#ccc',
                  },
                }}
              >
                Deposit from wallet
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={6}>
            <Button
              disabled={gear <= 0}
              onClick={() => dispatch(updateStateDialogWithdrawalToken(true))}
              fullWidth
              size={'large'}
              sx={{
                textTransform: 'capitalize',
                borderRadius: '0.6rem',
                bgcolor: 'white',
                fontWeight: 'bold',
                color: '#6552C4',
                '&:hover': {
                  bgcolor: '#ccc',
                },
              }}
            >
              Withdraw to wallet
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Typography
        component="h3"
        sx={{fontSize: '1.5rem', fontWeight: 700, mt: '2rem'}}
      >
        Claim in-game currency
      </Typography>
      <Divider sx={{borderColor: '#4A399F', my: '1rem'}}/>
      <Box
        sx={{
          borderRadius: '0.6rem',
          bgcolor: '#6c48da',
          p: '1.5rem',
          width: '30rem',
        }}
      >
        <Chip
          sx={{
            bgcolor: '#6c48da',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            '& .MuiChip-avatar': {
              width: '2rem',
              height: '2rem',
            },
          }}
          avatar={
            <Avatar
              alt="icon_gear"
              src="/service-www/icon/icon_vgear_mini.png"
              variant={'square'}
            ></Avatar>
          }
          label="vGear"
        />
        <Box my={'1rem'}>
          <Divider sx={{borderColor: '#8971FE'}}/>
          <Divider sx={{borderColor: '#4A399F'}}/>
        </Box>
        <Typography fontSize={'2rem'} fontWeight={'bold'}>
          {vGear} vGEAR
        </Typography>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
          mt={1}
          mb={2}
        >
          <Typography>Claimable {claimable}</Typography>
          <Tooltip
            title={`Token rewards must be claimed after ${minClaimDay} days earning from game`}
            placement="top"
            componentsProps={{
              tooltip: {
                sx: {
                  fontSize: '0.8rem',
                  backgroundColor: 'white',
                  color: '#F46D01',
                },
              },
            }}
          >
            <InfoOutlinedIcon fontSize={'small'}/>
          </Tooltip>
        </Stack>
        <Tooltip
          title={`Login wallet please`}
          placement="top"
          open={isEmpty(publicKey) ? true : false}
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                fontSize: '0.8rem',
                backgroundColor: 'white',
                color: '#F46D01',
              },
            },
            arrow: {
              sx: {
                '&::before': {
                  backgroundColor: 'white',
                },
              },
            },
          }}
        >
          <Button
            disabled={!publicKey || claimable <= 0}
            fullWidth
            onClick={() => dispatch(updateStateDialogClaimToken(true))}
            size={'large'}
            sx={{
              textTransform: 'capitalize',
              borderRadius: '0.6rem',
              bgcolor: 'white',
              fontWeight: 'bold',
              color: '#6552C4',
              '&:hover': {
                bgcolor: '#ccc',
              },
            }}
          >
            Claim
          </Button>
        </Tooltip>
      </Box>
      <ClaimGearModal
        tokenCoin={tokenCoin}
        tokenClaimable={claimable}
        feeClaim={feeClaim}
        minClaimAmount={minQuantityTokenTransfer}
      />
      <WithdrawalGearModal
        gear={gear}
        feeWithdrawal={feeWithdrawal}
        minWithdrawAmount={minQuantityTokenTransfer}
      />
      <DepositGearModal
        tokenCoin={tokenCoin}
        walletDepositAddress={walletTransfer}
        minDepositAmount={minQuantityTokenTransfer}
      />
    </Box>
  );
};

export default ClaimToken;
