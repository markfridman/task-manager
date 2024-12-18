import React from 'react';
import { useSetRecoilState } from 'recoil';
import { Box, Alert, Typography, Button, CircularProgress } from '@mui/material';
import { selectedTaskIdState } from '../../recoil/atoms';
import TaskItem from './TaskItem';
import { Task } from '../../types/task';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  deleteTask: (taskId: string) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, error, deleteTask }) => {
  const setSelectedTaskId = useSetRecoilState(selectedTaskIdState);

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
          onDelete={deleteTask}
        />
      ))}
    </Box>
  );
};

export default TaskList;