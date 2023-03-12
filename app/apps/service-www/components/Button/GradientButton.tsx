import { Button, styled } from '@mui/material';

const GradientButton = styled(Button)({
  minWidth: "16rem",
  height: "2.5rem",
  padding: '0 2rem',
  background: "linear-gradient(to right, rgba(90,9,251), rgba(151,39,237))",
  borderRadius: "3rem",
  textTransform: "capitalize",
  fontSize: "1.25rem",
  color: '#fff',
  fontWeight: 700,
  '&.Mui-disabled': {
    pointerEvents: 'auto',
    cursor: 'not-allowed'
  }
});

export default GradientButton;