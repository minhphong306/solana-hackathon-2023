import * as React from 'react';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export interface ViewOptionProps {
  view: number,
  setView: (value: number) => void
};
export default function ViewOption({view, setView}: ViewOptionProps) {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    nextView: number
  ) => {
    if (nextView !== null) {
      setView(nextView);
    }
  };

  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={handleChange}
      sx={{
        height: '3rem',
        bgcolor: 'background.default',
        border: '1px solid #4B319F',
        borderColor: 'secondary.main',
        borderRadius: '0.625rem',
        overflow: 'hidden'
      }}
    >
      <ToggleButton value={0} aria-label="view-option-grid">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.44444 11.5556H10.1111C10.4942 11.5556 10.8616 11.4034 11.1325 11.1325C11.4034 10.8616 11.5556 10.4942 11.5556 10.1111V1.44444C11.5556 1.06135 11.4034 0.693954 11.1325 0.423068C10.8616 0.152182 10.4942 0 10.1111 0H1.44444C1.06135 0 0.693954 0.152182 0.423068 0.423068C0.152182 0.693954 0 1.06135 0 1.44444V10.1111C0 10.4942 0.152182 10.8616 0.423068 11.1325C0.693954 11.4034 1.06135 11.5556 1.44444 11.5556ZM15.8889 11.5556H24.5556C24.9386 11.5556 25.306 11.4034 25.5769 11.1325C25.8478 10.8616 26 10.4942 26 10.1111V1.44444C26 1.06135 25.8478 0.693954 25.5769 0.423068C25.306 0.152182 24.9386 0 24.5556 0H15.8889C15.5058 0 15.1384 0.152182 14.8675 0.423068C14.5966 0.693954 14.4444 1.06135 14.4444 1.44444V10.1111C14.4444 10.4942 14.5966 10.8616 14.8675 11.1325C15.1384 11.4034 15.5058 11.5556 15.8889 11.5556ZM1.44444 26H10.1111C10.4942 26 10.8616 25.8478 11.1325 25.5769C11.4034 25.306 11.5556 24.9386 11.5556 24.5556V15.8889C11.5556 15.5058 11.4034 15.1384 11.1325 14.8675C10.8616 14.5966 10.4942 14.4444 10.1111 14.4444H1.44444C1.06135 14.4444 0.693954 14.5966 0.423068 14.8675C0.152182 15.1384 0 15.5058 0 15.8889V24.5556C0 24.9386 0.152182 25.306 0.423068 25.5769C0.693954 25.8478 1.06135 26 1.44444 26ZM15.8889 26H24.5556C24.9386 26 25.306 25.8478 25.5769 25.5769C25.8478 25.306 26 24.9386 26 24.5556V15.8889C26 15.5058 25.8478 15.1384 25.5769 14.8675C25.306 14.5966 24.9386 14.4444 24.5556 14.4444H15.8889C15.5058 14.4444 15.1384 14.5966 14.8675 14.8675C14.5966 15.1384 14.4444 15.5058 14.4444 15.8889V24.5556C14.4444 24.9386 14.5966 25.306 14.8675 25.5769C15.1384 25.8478 15.5058 26 15.8889 26Z" fill="#8F8BE2"/>
        </svg>

      </ToggleButton>
      <ToggleButton value={1} aria-label="view-option-list">
        <svg width="29" height="27" viewBox="0 0 29 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="7.80769" height="7.80769" rx="2" fill="#8F8BE2"/>
          <rect y="10.0386" width="7.80769" height="6.69231" rx="2" fill="#8F8BE2"/>
          <rect y="18.9614" width="7.80769" height="7.80769" rx="2" fill="#8F8BE2"/>
          <rect x="10.0385" width="18.9615" height="7.80769" rx="2" fill="#8F8BE2"/>
          <rect x="10.0385" y="10.0386" width="18.9615" height="6.69231" rx="2" fill="#8F8BE2"/>
          <rect x="10.0385" y="18.9614" width="18.9615" height="7.80769" rx="2" fill="#8F8BE2"/>
        </svg>
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
