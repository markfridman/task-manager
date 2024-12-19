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
    tasks, 
    loading, 
    error, 
    pagination: { totalPages, totalItems },
    deleteTask
  } = useTasks();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Management
        </Typography>
      </Box>

      <TaskFilters loading={loading} />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Task List Column */}
        <Grid item xs={12} md={8}>
          <Box sx={{ bgcolor: 'background.paper', borderRadius: 1, p: 2 }}>
            <TaskList 
              tasks={tasks}
              loading={loading}
              error={error}
              deleteTask={deleteTask}
            />
            <Box mt={2}>
              <Pagination 
                totalPages={totalPages}
                totalItems={totalItems}
                loading={loading}
              />
            </Box>
          </Box>
        </Grid>

        {/* Task Creation Form Column */}
        <Grid item xs={12} md={4}>
          <TaskCreationForm />
        </Grid>
      </Grid>

      <TaskFormModal />
    </Container>
  );
};

export default TaskWrapper;