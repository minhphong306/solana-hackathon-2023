import * as React from 'react';
import {gql, useMutation} from '@apollo/client';
import * as anchor from '@project-serum/anchor';
import * as spl from '@solana/spl-token';
import {
  useAppContext,
  updateStateloadingPage,
  updateStateDialogListRentOut,
} from '../AppContext';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import {useSnackbar} from 'notistack';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import {useWallet, useConnection} from '@solana/wallet-adapter-react';
import Divider from "@mui/material/Divider";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRentProgram } from '../RentProgramProvider';
import getListingTransaction from '../../utils/instructions/listing';
import sendSignedTransaction from '../../utils/transactions/ sendSignedTransaction';

export type RentOutListingModalProps = {
  name: string;
  nftAddress: string;
};

const LIST_RENTING_ASSET_MUTATION = gql`
  mutation listRentingAsset($tx: String!, $price: Float!, $numberOfDay: Int!, $isContinueListing: Boolean!, $nftAddress: String!) {
	listRentingAsset(input:{
    tx: $tx,
    price: $price,
    numberOfDay: $numberOfDay,
    isContinueListing: $isContinueListing,
    nftAddress: $nftAddress
  })
}
`;

const RentOutListingModal = ({name, nftAddress}: RentOutListingModalProps): JSX.Element => {
  const {state, dispatch} = useAppContext();
  const {enqueueSnackbar} = useSnackbar();
  const [listRentingAsset] = useMutation(LIST_RENTING_ASSET_MUTATION);
  const [inputBOT, setInputBOT] = React.useState<number>(0);
  const [inputDay, setInputDay] = React.useState<number>(0);
  const [gear, setGear] = React.useState<number>(0);
  const [feeDeposit, setFeeDeposit] = React.useState<number>(0.00001);
  const [showBtnSubmit, setShowBtnSubmit] = React.useState<boolean>(true);
  const {publicKey, signTransaction} = useWallet();
  const {connection} = useConnection();
  const {rentProgram} = useRentProgram();

  const [selectedOption, setSelectedOption] = React.useState<number>(1);

  const handleChangeSelectOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(Number(event.target.value));
    console.log(selectedOption, 'selectedOption');
  };

  const closeModalDeposit = () => {
    dispatch(updateStateDialogListRentOut(false));
    setGear(0);
    setInputBOT(0);
    setInputDay(0);
  };

  const onChangeInputBOT = (event: React.ChangeEvent<any>) => {
    setInputBOT(parseFloat(event.target.value));
  };

  const onChangeInputDay = (event: React.ChangeEvent<any>) => {
    setInputDay(parseInt(event.target.value));
  };

  const handleSubmitListUp = async (e: React.MouseEvent<any>) => {
    e.preventDefault();
    dispatch(updateStateloadingPage(true));
    console.log(inputBOT, 'inputBOT');
    console.log(inputDay, 'inputDay');
    console.log(selectedOption, 'selectedOption');
    console.log(rentProgram, 'rentProgram');
    console.log(nftAddress, 'nftAddress');
    try {
      const transaction = await getListingTransaction(nftAddress, inputBOT, inputDay, selectedOption, rentProgram);
      const signedTx = await rentProgram.provider.wallet.signTransaction(transaction);
      const {txid} = await sendSignedTransaction({
        connection: connection,
        signedTransaction: signedTx,
      });

      console.log("Tx id: ", txid);

      await listRentingAsset({
        variables: {
          tx: txid,
          price: inputBOT,
          numberOfDay: inputDay,
          isContinueListing: selectedOption === 0 ? false : true,
          nftAddress: nftAddress
        },
        onCompleted: (data) => {
          dispatch(updateStateloadingPage(false));
          dispatch(updateStateDialogListRentOut(false));
          setShowBtnSubmit(false);
          setGear(0);
          setInputBOT(0);
          setInputDay(0);
          enqueueSnackbar('Listing successfully', {variant: 'success'});
        },
        refetchQueries: [
          'inventoryDetail'
        ]
      });
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
      });
      dispatch(updateStateloadingPage(false));
    }
  };

  // React.useEffect(() => {
  //   if (state.profile.claimToken.dialogDepositToken) {
  //     getBalanceUserDeposit();
  //   }
  // }, [state.profile.claimToken.dialogDepositToken]);

  React.useEffect(() => {
    if (inputBOT > 0 && inputDay > 0 && inputBOT <= 30 && inputDay <= 30) {
      setShowBtnSubmit(false);
    } else {
      setShowBtnSubmit(true);
    }
  }, [inputBOT, inputDay]);

  return (
    <Modal
      open={state.renting.dialogListRentOut}
      aria-labelledby="modal-setup-account"
      aria-describedby="modal-setup-account"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form onSubmit={handleSubmitListUp}>
        <Box
          sx={{
            color: 'text.primary',
            borderRadius: '0.6rem',
            bgcolor: '#6c48da',
            p: '1rem',
            pb: '3rem',
            width: '33rem',
          }}
        >
          <Stack
            justifyContent={'end'}
            direction={'row'}
            onClick={closeModalDeposit}
            sx={{cursor: 'pointer'}}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 1L1 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 1L13 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Stack>
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            direction={'column'}
            spacing={3}
            sx={{px: '1rem'}}
          >
            <Typography
              variant="h5"
              component={'div'}
              sx={{fontWeight: '600'}}
            >
              Rent out {name}
            </Typography>
            <Typography
              component={'div'}
            >
              {name} will be listed on the Marketplace for rental
            </Typography>
            <TextField
              fullWidth
              id="outlined-end-adornment"
              type={'number'}
              value={inputDay}
              onChange={onChangeInputDay}
              sx={{
                m: 1,
                borderRadius: '0.6rem',
                backgroundColor: '#130C35',
                label: {
                  color: 'white',
                },
                fieldset: {
                  borderColor: '#675CAB',
                  borderRadius: '0.6rem',
                },
                '&.MuiFormControl-root': {
                  marginTop: 1,
                },
                '& input[type=number]': {
                  '-moz-appearance': 'textfield',
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position={'end'}>
                    <Typography sx={{color: 'white'}}>Day</Typography>
                  </InputAdornment>
                ),
              }}
            />
            <Box
              textAlign={'left'}
              sx={{
                width: '100%',
                '&.MuiBox-root': {
                  marginTop: 1,
                },
              }}
            >
              <Typography
                component={'div'}
                fontSize={'0.875rem'}
                color={'gold'}
              >
                Minimum 1 day - Maxium 30 days
              </Typography>
            </Box>
            <TextField
              fullWidth
              id="outlined-end-adornment"
              type={'number'}
              value={inputBOT}
              onChange={onChangeInputBOT}
              sx={{
                m: 1,
                borderRadius: '0.6rem',
                backgroundColor: '#130C35',
                label: {
                  color: 'white',
                },
                fieldset: {
                  borderColor: '#675CAB',
                  borderRadius: '0.6rem',
                },
                '&.MuiFormControl-root': {
                  marginTop: 1,
                },
                '& input[type=number]': {
                  '-moz-appearance': 'textfield',
                },
                '& input[type=number]::-webkit-outer-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
                '& input[type=number]::-webkit-inner-spin-button': {
                  '-webkit-appearance': 'none',
                  margin: 0,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position={'end'}>
                    <Typography sx={{color: 'white'}}>BOT</Typography>
                  </InputAdornment>
                ),
              }}
            />
            <Box
              textAlign={'left'}
              sx={{
                width: '100%',
                '&.MuiBox-root': {
                  marginTop: 1,
                },
              }}
            >
              <Typography
                component={'div'}
                fontSize={'0.875rem'}
                color={'gold'}
              >
                Minimum 1 day - Maxium 30 days
              </Typography>
            </Box>
            <Box
              textAlign={'left'}
              sx={{
                width: '100%',
                '&.MuiBox-root': {
                  marginTop: 1,
                },
              }}
            >
              <Typography fontSize={'0.875rem'} color={'white'}>
                You&rsquo;ll receive
                <Typography
                  component={'span'}
                  fontSize={'0.875rem'}
                  color={'aqua'}
                >
                  {' '}
                  {feeDeposit} BOT
                </Typography>{' '}
                after subtracting
                <Typography
                  component={'span'}
                  fontSize={'0.875rem'}
                  color={'aqua'}
                >
                  {' '}
                  {feeDeposit} BOT
                </Typography>{' '}
              </Typography>
            </Box>
            <Divider sx={{borderColor: 'white', width: '100%'}}/>
            <Box
              textAlign={'left'}
              sx={{
                width: '100%',
              }}
            >
              <Typography>
                When renters use up the lease duration, NFT will:
              </Typography>
            </Box>
            <Box
              textAlign={'left'}
              sx={{
                width: '100%',
              }}
            >
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                onChange={handleChangeSelectOption}
                defaultValue={selectedOption}
              >
                <FormControlLabel value={0} control={<Radio/>} sx={{
                  '.MuiSvgIcon-root': {
                    color: 'white'
                  }
                }} label="List back onto marketplace"/>
                <FormControlLabel value={1} control={<Radio/>} sx={{
                  '.MuiSvgIcon-root': {
                    color: 'white'
                  }
                }} label="Return inventory"/>
              </RadioGroup>
            </Box>

            <LoadingButton
              disabled={showBtnSubmit}
              variant="contained"
              type={'submit'}
              fullWidth
              loading={false}
              sx={{
                color: '#5B47C0',
                backgroundColor: 'white',
                borderRadius: '0.4rem',
                textTransform: 'capitalize',
                fontWeight: 'bold',
                '&:hover': {
                  color: 'white',
                },
              }}
              size={'large'}
            >
              List up for rental
            </LoadingButton>
          </Stack>
        </Box>
      </form>
    </Modal>
  );
};

export default RentOutListingModal;
