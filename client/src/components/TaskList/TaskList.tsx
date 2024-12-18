import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Box, Alert, Typography, Button } from '@mui/material';
import { selectedTaskIdState } from '../../recoil/atoms';
import { useTasks } from '../../hooks/useTasks';
import TaskItem from './TaskItem';
import TaskFilters from '../TaskFilters/TaskFilters';
import TaskFormModal from '../TaskForm/TaskFormModal';
import Pagination from '../Pagination';

const TaskList: React.FC = () => {
  const { 
    tasks,
    loading,
    error,
    refreshTasks,
    deleteTask,
    pagination: { totalPages, totalItems }
  } = useTasks();
  const setSelectedTaskId = useSetRecoilState(selectedTaskIdState);

  return (
    <Box>
      <Box mt={2}>
        {error ? (
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={refreshTasks}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : tasks.length === 0 && !loading ? (
          <Typography variant="h6" textAlign="center" color="text.secondary">
            No tasks found
          </Typography>
        ) : (
          tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onSelect={() => setSelectedTaskId(task.id)}
              onDelete={deleteTask}
            />
          ))
        )}
      </Box>
      <Pagination 
        totalPages={totalPages} 
        totalItems={totalItems}
        loading={loading}
      />
      <TaskFormModal />
    </Box>
  );
};

export default TaskList;