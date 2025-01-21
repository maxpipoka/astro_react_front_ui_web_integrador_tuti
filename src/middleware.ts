import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  
  // Get auth data from localStorage if available
  let authData = null;
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      try {
        authData = JSON.parse(stored);
      } catch (e) {
        // Invalid stored data
      }
    }
  }

  // If we're on the auth page and already logged in, redirect to home
  if (pathname === '/auth' && authData?.state?.token) {
    return context.redirect('/');
  }

  // If we're not on auth page and not logged in, redirect to login
  if (pathname !== '/auth' && !authData?.state?.token) {
    return context.redirect('/auth');
  }

  // Continue to requested route
  return next();
});