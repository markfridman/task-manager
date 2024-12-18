import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Box,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedTaskIdState, tasksState } from '../../recoil/atoms';
import { TaskPriority, TaskStatus, UpdateTaskDto } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';

const statusOptions: TaskStatus[] = ['To Do', 'In Progress', 'Completed'];
const priorityOptions: TaskPriority[] = ['Low', 'Medium', 'High'];

const TaskFormModal: React.FC = () => {
  const [selectedTaskId, setSelectedTaskId] = useRecoilState(selectedTaskIdState);
  const tasks = useRecoilValue(tasksState);
  const { updateTask } = useTasks();
  const selectedTask = tasks.find(task => task.id === selectedTaskId);
  
  const [formData, setFormData] = React.useState<UpdateTaskDto>({
    title: '',
    description: '',
    dueDate: new Date().toISOString(),
    status: 'To Do',
    priority: 'Medium',
    tags: [],
  });

  React.useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title,
        description: selectedTask.description,
        dueDate: selectedTask.dueDate,
        status: selectedTask.status,
        priority: selectedTask.priority,
        tags: selectedTask.tags,
      });
    }
  }, [selectedTask]);

  const handleClose = () => {
    setSelectedTaskId(null);
    setFormData({
      title: '',
      description: '',
      dueDate: new Date().toISOString(),
      status: 'To Do',
      priority: 'Medium',
      tags: [],
    });
  };

  const handleChange = (field: keyof UpdateTaskDto) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, dueDate: date.toISOString() }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedTaskId) {
      try {
        await updateTask(selectedTaskId, formData);
        handleClose();
      } catch (error) {
        console.error('Failed to update task:', error);
      }
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToDelete) || [],
    }));
  };

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && event.currentTarget.value) {
      event.preventDefault();
      const newTag = event.currentTarget.value;
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag],
      }));
      event.currentTarget.value = '';
    }
  };

  return (
    <Dialog open={!!selectedTaskId} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleChange('title')}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={4}
              fullWidth
            />
            <DatePicker
              label="Due Date"
              value={formData.dueDate ? new Date(formData.dueDate) : null}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <TextField
              select
              label="Status"
              value={formData.status}
              onChange={handleChange('status')}
              fullWidth
            >
              {statusOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Priority"
              value={formData.priority}
              onChange={handleChange('priority')}
              fullWidth
            >
              {priorityOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <Box>
              <TextField
                label="Add Tags (Press Enter)"
                onKeyPress={handleTagAdd}
                fullWidth
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.tags?.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleTagDelete(tag)}
                  />
                ))}
              </Box>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskFormModal;