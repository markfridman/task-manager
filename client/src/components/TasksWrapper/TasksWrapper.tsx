import React from 'react'
import TaskList from '../TaskList/TaskList'
import TaskFilters from '../TaskFilters/TaskFilters'

export const TasksWrapper = () => {
  return (
    <div>
      <TaskFilters />
      <TaskList />
    </div>
  )
}
