import { Theme } from '@mui/material/styles';

export const styles = {
  filterPaper: {
    mb: 2,
    p: 2,
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
  },
  clearButton: {
    mr: 1,
  },
  filterIcon: {
    transform: 'rotate(90deg)',
  },
};