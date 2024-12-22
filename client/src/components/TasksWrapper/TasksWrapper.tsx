import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import TaskList from '../TaskList/TaskList';
import TaskFilters from '../TaskFilters/TaskFilters';
import Pagination from '../Pagination';
import TaskFormModal from '../TaskForm/TaskFormModal';
import TaskCreationForm from '../TaskCreation/TaskCreationForm';
import { useTasks } from '../../hooks/useTasks';

const TaskWrapper: React.FC = () => {
  const {
    loading,
  } = useTasks();

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', width: '100%' }}
    >

      <Container maxWidth="xl" sx={{ py: 4 }} >
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Task Management
          </Typography>
        </Box>

        <TaskFilters loading={loading} />
        <Grid container sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', msFlexDirection: 'row' }}>

          <Grid item xs={12} md={8} sx={{ mt: 2, height: '70vh', maxHeight: '70vh', overflowY: 'auto' }}>
            {/* Task List Column */}
            <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2 }}>
              <TaskList />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            {/* Task Creation Form Column */}
            <TaskCreationForm />
          </Grid>
        </Grid>
        <Pagination />

        <TaskFormModal />
      </Container>
    </Grid>
  );
};

export default TaskWrapper;