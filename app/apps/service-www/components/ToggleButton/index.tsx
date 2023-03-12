import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';

export interface ToggleButtonProps {
  name: string;
}

export default function CustomToggleButton(props: ToggleButtonProps) {
  const [formats, setFormats] = React.useState(() => ['bold', 'italic']);

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
  };

  return (
    <Box>
      <Box>
        <ToggleButtonGroup
          value={formats}
          onChange={handleFormat}
          aria-label="text formatting"
          fullWidth
        >
          <ToggleButton
            value={props.name}
            aria-label={props.name}
            sx={{
              height: '2rem',
              bgcolor: 'secondary.dark',
              color: 'text.primary',
              textTransform: 'capitalize',
            }}
          >
            {props.name}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
}
