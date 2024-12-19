import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Stack,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Task } from '../../types/task';

export interface TaskItemProps {
  task: Task;
  onSelect: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onSelect }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 3 } }} onClick={onSelect}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography variant="h6" gutterBottom>
              {task.title}
            </Typography>
            {/* <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
              {task.description}
            </Typography> */}
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                label={task.status}
                color={task.status === 'Completed' ? 'success' : 'default'}
              />
              <Chip
                size="small"
                label={task.priority}
                color={getPriorityColor(task.priority) as any}
              />
              <Typography variant="caption" color="text.secondary">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </Stack>
          </Box>

        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskItem;