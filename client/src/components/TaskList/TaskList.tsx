import React from 'react';
import { useSetRecoilState } from 'recoil';
import { Box, Alert, Typography, Button, CircularProgress } from '@mui/material';
import { selectedTaskIdState } from '../../recoil/atoms';
import TaskItem from './TaskItem';

import { useTasks } from '../../hooks/useTasks';


const TaskList: React.FC = () => {
  const setSelectedTaskId = useSetRecoilState(selectedTaskIdState);
  const { loading, error, tasks } = useTasks();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => window.location.reload()}>
            Retry
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (!tasks.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography variant="h6" color="text.secondary">
          No tasks found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onSelect={() => setSelectedTaskId(task.id)}
        />
      ))}
    </Box>
  );
};

export default TaskList;