// src/components/TaskFilters/TaskFilters.tsx
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {
  Paper,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Box,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { taskFiltersState, paginationState } from '../../recoil/atoms';
import { TaskStatus, TaskPriority } from '../../types/task';
import { useDebounce } from '../../hooks/useDebounce';
import { TASK_PRIORITIES, TASK_STATUSES } from '../../constants/task';

const statusOptions: TaskStatus[] = TASK_STATUSES;
const priorityOptions: TaskPriority[] = TASK_PRIORITIES;
const sortByOptions = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' },
  { value: 'creationTime', label: 'Creation Time' },
];

interface TaskFiltersProps {
  loading?: boolean;
}
const TaskFilters: React.FC<TaskFiltersProps> = ({ loading = false }) => {
  const [filters, setFilters] = useRecoilState(taskFiltersState);
  const [pagination, setPagination] = useRecoilState(paginationState);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput);

  // Effect for debounced search
  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearch || undefined }));
  }, [debouncedSearch, setFilters]);

  const handleFilterChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters(prev => ({ ...prev, [field]: event.target.value }));
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDateChange = (field: 'startDate' | 'endDate') => (date: Date | null) => {
    setFilters(prev => ({
      ...prev,
      [field]: date ? date.toISOString() : undefined,
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPagination(prev => ({
      ...prev,
      sortBy: event.target.value,
    }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };
  const clearSearch = () => {
    setSearchInput('');
  };

  const clearAllFilters = () => {
    setFilters({
      status: undefined,
      priority: undefined,
      search: undefined,
      tags: undefined,
      startDate: undefined,
      endDate: undefined,
      taskOwner: undefined,
    });
    setPagination(prev => ({
      ...prev,
      page: 1,
      sortBy: 'creationTime',
      sortOrder: 'desc',
    }));
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search Tasks"
            value={searchInput}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress size={20} />
                  ) : searchInput ? (
                    <IconButton size="small" onClick={clearSearch}>
                      <ClearIcon />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            label="Status"
            value={filters.status || ''}
            onChange={handleFilterChange('status')}
          >
            <MenuItem value="">All</MenuItem>
            {statusOptions.map(status => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Priority Filter */}
        <Grid item xs={12} md={2}>
          <TextField
            select
            fullWidth
            label="Priority"
            value={filters.priority || ''}
            onChange={handleFilterChange('priority')}
          >
            <MenuItem value="">All</MenuItem>
            {priorityOptions.map(priority => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Date Range */}
        <Grid item xs={12} md={2}>
          <DatePicker
            label="Start Date"
            value={filters.startDate ? new Date(filters.startDate) : null}
            onChange={handleDateChange('startDate')}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <DatePicker
            label="End Date"
            value={filters.endDate ? new Date(filters.endDate) : null}
            onChange={handleDateChange('endDate')}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>

        {/* Sort Controls */}
        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            label="Sort By"
            value={pagination.sortBy}
            onChange={handleSortChange}
          >
            {sortByOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            select
            fullWidth
            label="Sort Order"
            value={pagination.sortOrder}
            onChange={(e) => setPagination(prev => ({
              ...prev,
              sortOrder: e.target.value as 'asc' | 'desc',
            }))}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </TextField>
        </Grid>

        {/* Clear Filters */}
        <Grid item xs={12} md={6}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton
              onClick={clearAllFilters}
              color="primary"
              title="Clear all filters"
            >
              <FilterIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TaskFilters;