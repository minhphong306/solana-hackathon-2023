import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const debug = require('debug')('components:PasswordTextfield');

export type PasswordTextfieldProps = {
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (event: React.ChangeEvent<any>) => void;
  bgColor: string;
  label: string;
  error?: boolean;
};

const PasswordTextfield = ({
  value,
  onChange,
  bgColor,
  label,
  error,
}: PasswordTextfieldProps): JSX.Element => {
  debug('render');

  const [isShowPassword, setShowPassword] = React.useState(false);

  const onClickVisibility = () => {
    setShowPassword(!isShowPassword);
  };

  return (
    <FormControl
      error={error}
      required
      fullWidth
      sx={{
        borderRadius: '0.6rem',
        backgroundColor: bgColor,
        label: {
          color: 'white',
        },
        fieldset: {
          borderColor: '#675cab',
          borderRadius: '0.6rem',
        },
      }}
      variant="outlined"
    >
      <InputLabel htmlFor={`outlined-adornment-${label}`}>{label}</InputLabel>
      <OutlinedInput
        id={`outlined-adornment-${label}`}
        type={isShowPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={onClickVisibility}
              edge="end"
            >
              {isShowPassword ? (
                <VisibilityOffOutlinedIcon sx={{ color: 'white' }} />
              ) : (
                <VisibilityOutlinedIcon sx={{ color: 'white' }} />
              )}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  );
};

if (process.env.NODE_ENV !== 'production') {
  PasswordTextfield.displayName = 'components__PasswordTextfield';
}

export default PasswordTextfield;
