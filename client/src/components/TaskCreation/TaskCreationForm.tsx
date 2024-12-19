import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Stack,
  MenuItem,
  Box,
  Typography,
  Chip,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Add as AddIcon, Clear as ClearIcon, ShowChart } from '@mui/icons-material';
import { CreateTaskDto, TaskPriority, TaskStatus } from '../../types/task';
import { useTasks } from '../../hooks/useTasks';
import { addDays } from '../../utils/date';
import { TASK_PRIORITIES } from '../../constants/task';
import { useNotification } from '../../hooks/useNotification';

const initialFormState: CreateTaskDto = {
  title: '',
  description: '',
  dueDate: addDays(new Date(), 3).toISOString(),
  status: 'To Do',
  taskOwner: '',
  priority: 'Medium',
  tags: [],
};

const TaskCreationForm: React.FC = () => {
  const [formData, setFormData] = useState<CreateTaskDto>(initialFormState);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { createTask, refreshTasks } = useTasks();
  const { showSuccess, showError } = useNotification();
  const handleChange = (field: keyof CreateTaskDto) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, dueDate: date.toISOString() }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await createTask(formData);
      showSuccess('Task created successfully');
      setFormData(initialFormState);
      setTagInput('');
      refreshTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      showError('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Create New Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
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
            value={new Date(formData.dueDate)}
            onChange={handleDateChange}
            slotProps={{ textField: { fullWidth: true } }}
          />

          <TextField
            select
            label="Priority"
            value={formData.priority}
            onChange={handleChange('priority')}
            fullWidth
          >
            {TASK_PRIORITIES.map((priority) => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Task Owner"
            value={formData.taskOwner}
            onChange={handleChange('taskOwner')}
            required
            fullWidth
          />

          <TextField
            label="Add Tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddTag} size="small">
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
          />

          {formData.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default TaskCreationForm;