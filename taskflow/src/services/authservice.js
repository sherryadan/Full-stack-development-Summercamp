import { isSupabaseConfigured, supabase } from '../lib/supabase.jsx'

function ok(data) {
  return { data, error: null }
}

function fail(message) {
  return { data: null, error: message }
}

function getErrorMessage(error) {
  if (!error) return 'Something went wrong.'
  return error.message || 'Something went wrong.'
}

/**
 * Create a new account with email, password, and display name.
 */
export async function signUp({ name, email, password, confirmPassword }) {
  try {
    const trimmedName = name?.trim() || ''
    const trimmedEmail = email?.trim() || ''

    if (!trimmedName) {
      return fail('Please enter your name.')
    }

    if (!trimmedEmail) {
      return fail('Please enter an email.')
    }

    if (!password) {
      return fail('Please enter a password.')
    }

    if (password.length < 6) {
      return fail('Password must be at least 6 characters.')
    }

    if (password !== confirmPassword) {
      return fail('Passwords do not match.')
    }

    if (!isSupabaseConfigured) {
      return fail('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable sign up.')
    }

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: { name: trimmedName },
      },
    })

    if (error) {
      return fail(getErrorMessage(error))
    }

    return ok(data)
  } catch (error) {
    return fail(getErrorMessage(error))
  }
}

/**
 * Log in an existing user with email and password.
 */
export async function signIn({ email, password }) {
  try {
    const trimmedEmail = email?.trim() || ''

    if (!trimmedEmail) {
      return fail('Please enter an email.')
    }

    if (!password) {
      return fail('Please enter a password.')
    }

    if (!isSupabaseConfigured) {
      return fail('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable log in.')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    })

    if (error) {
      return fail(getErrorMessage(error))
    }

    return ok(data)
  } catch (error) {
    return fail(getErrorMessage(error))
  }
}

/**
 * Log out the current authenticated user.
 */
export async function signOut() {
  try {
    if (!isSupabaseConfigured) {
      return fail('Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable log out.')
    }

    const { error } = await supabase.auth.signOut()

    if (error) {
      return fail(getErrorMessage(error))
    }

    return ok(true)
  } catch (error) {
    return fail(getErrorMessage(error))
  }
}
