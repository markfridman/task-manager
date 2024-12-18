import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { RecoilRoot } from 'recoil';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { theme } from './theme';
import TasksWrapper from './components/TasksWrapper/TasksWrapper';

function App() {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <TasksWrapper />
        </LocalizationProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;