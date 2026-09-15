import { supabase } from '../lib/supabase.jsx'

const TASK_COLUMNS = 'id, title, description, priority, completed, user_id, created_at'

// Every function in this file returns the same shape:
// { data: ..., error: null } when it works
// { data: null, error: "message" } when it fails
function ok(data) {
  return { data, error: null }
}

function fail(message) {
  return { data: null, error: message }
}

function getErrorMessage(error) {
  if (!error) return 'Something went wrong with the database.'
  return error.message || 'Something went wrong with the database.'
}

/**
 * Load tasks for one user, newest first.
 * @param {string} userId
 */
export async function getTasks(userId) {
  try {
    if (!userId) {
      return fail('Log in to view your tasks.')
    }

    const { data, error } = await supabase
      .from('tasks')
      .select(TASK_COLUMNS)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return fail(getErrorMessage(error))
    }

    return ok(data ?? [])
  } catch (error) {
    return fail(getErrorMessage(error))
  }
}

/**
 * Insert a new task row.
 * Pass an object like { title, description, priority, user_id }.
 * @param {object} task
 */
export async function createTasks(task) {
  try {
    const title = task?.title?.trim() || ''
    const description = task?.description?.trim() || null
    const priority = task?.priority || 'medium'
    const userId = task?.user_id

    if (!title) {
      return fail('Please enter a title.')
    }

    if (!userId) {
      return fail('Log in to save a task.')
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, description, priority, completed: false, user_id: userId })
      .select(TASK_COLUMNS)
      .single()

    if (error) {
      return fail(getErrorMessage(error))
    }

    return ok(data)
  } catch (error) {
    return fail(getErrorMessage(error))
  }
}

/**
 * Change fields on an existing task, such as completed or title.
 * @param {string} taskId
 * @param {object} updates
 */
export async function updateTask(taskId, updates) {
  try {
    if (!taskId) {
      return fail('A task id is required to update a task.')
    }

    if (!updates || Object.keys(updates).length === 0) {
      return fail('No updates were provided.')
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .select(TASK_COLUMNS)
      .single()

    if (error) {
      return fail(getErrorMessage(error))
    }

    return ok(data)
  } catch (error) {
    return fail(getErrorMessage(error))
  }
}

/**
 * Remove a task by id.
 * @param {string} taskId
 */
export async function deleteTasks(taskId) {
  try {
    if (!taskId) {
      return fail('A task id is required to delete a task.')
    }

    const { error } = await supabase.from('tasks').delete().eq('id', taskId)

    if (error) {
      return fail(getErrorMessage(error))
    }

    return ok({ id: taskId })
  } catch (error) {
    return fail(getErrorMessage(error))
  }
}