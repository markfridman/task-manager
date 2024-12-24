import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {
  Box,
  IconButton,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
} from '@mui/icons-material';
import { paginationState } from '../recoil/atoms';
import { useTasks } from '../hooks/useTasks';


const Pagination: React.FC = () => {

  const [pagination, setPagination] = useRecoilState(paginationState);
  const { loading, pagination: { totalPages, totalItems } } = useTasks()
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  useEffect(() => {
    console.log('Pagination changed:', pagination);
  }, [totalPages, totalItems])
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        my: 2,
        gap: 2,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          onClick={() => handlePageChange(1)}
          disabled={pagination.page === 1 || loading}
        >
          <FirstPage />
        </IconButton>
        <IconButton
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1 || loading}
        >
          <KeyboardArrowLeft />
        </IconButton>

        <Box sx={{ minWidth: 100, textAlign: 'center' }}>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography variant="body2">
              Page {pagination.page} of {totalPages}
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'text.secondary' }}
              >
                Total items: {totalItems}
              </Typography>
            </Typography>
          )}
        </Box>

        <IconButton
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === totalPages || loading}
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={() => handlePageChange(totalPages)}
          disabled={pagination.page === totalPages || loading}
        >
          <LastPage />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default Pagination;