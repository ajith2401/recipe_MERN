import CircularProgress from '@mui/material/CircularProgress';

function LoadingIcon() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <CircularProgress />
    </div>
  );
}

export default LoadingIcon;
