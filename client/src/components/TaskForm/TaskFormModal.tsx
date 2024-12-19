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
import { TASK_PRIORITIES, TASK_STATUSES } from '../../constants/task';
import { useNotification } from '../../hooks/useNotification';

const statusOptions: TaskStatus[] = TASK_STATUSES;
const priorityOptions: TaskPriority[] = TASK_PRIORITIES;

const TaskFormModal: React.FC = () => {
  const [selectedTaskId, setSelectedTaskId] = useRecoilState(selectedTaskIdState);
  const [ tagInput ,setTagInput ] = React.useState('');
  const [isChanged, setIsChanged] = React.useState(false);
  const tasks = useRecoilValue(tasksState);
  const { updateTask, deleteTask } = useTasks();
  const { showSuccess, showError, showWarning } = useNotification();

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
    setIsChanged(true);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, dueDate: date.toISOString() }));
      setIsChanged(true);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isChanged) showWarning('No changes detected');
    if (selectedTaskId && isChanged) {
      try {
        await updateTask(selectedTaskId, formData);
        handleClose();
        showSuccess('Task updated successfully');
      } catch (error) {
        showError('Failed to update task');
        console.error('Failed to update task:', error);
        handleClose();
      } finally {
        setIsChanged(false);
      }
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToDelete) || [],
    }));
    setIsChanged(true);
  };

  const handleTaskDelete = async () => {
    if (selectedTaskId) {
      try {
        await deleteTask(selectedTaskId);
        handleClose();
      } catch (error) {
        showError('Failed to update task');
        console.error('Failed to update task:', error);
      }
    }
  }

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tagInput && !formData.tags?.includes(tagInput.trim())) {
      event.preventDefault();
      const newTag = tagInput;
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag],
      }));
      setTagInput('');
      setIsChanged(true);
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            />
            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              multiline
              rows={4}
              fullWidth
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
            >
              {priorityOptions.map(option => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <Box>
              <TextField
                label="Add Tags (Press Enter)"
                onChange={(e) => setTagInput(e.target.value)}
                value={tagInput}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (tagInput.trim()) {
                      handleTagAdd(e);
                    }
                  }
                }}
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
        <DialogActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {selectedTaskId &&
            (<Box p={2} >
              <Button color="error" onClick={() => handleTaskDelete()}> Delete</Button>
            </Box>
            )
          }
          <Box p={2} sx={{ display: 'flex', gap: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskFormModal;