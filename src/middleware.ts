import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Skip middleware for auth page
  if (pathname === '/auth') {
    return next();
  }

  // For all other routes, check authentication
  let authData = null;
  const cookies = context.request.headers.get('cookie');
  if (cookies) {
    const authCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('auth-storage='));
    if (authCookie) {
      try {
        authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
      } catch (e) {
        console.error('Invalid stored data', e);
      }
    }
  }

  // If not logged in, redirect to auth
  if (!authData?.state?.token) {
    return context.redirect('/auth');
  }

  // Continue to requested route
  return next();
});