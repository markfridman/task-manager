import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import TaskList from '../TaskList/TaskList';
import TaskFilters from '../TaskFilters/TaskFilters';
import Pagination from '../Pagination';
import TaskFormModal from '../TaskForm/TaskFormModal';
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Task Management
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TaskFilters loading={loading} />
      </Paper>

      <Paper sx={{ p: 2, minHeight: '60vh' }}>
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
      </Paper>

      <TaskFormModal />
    </Container>
  );
};

export default TaskWrapper;
