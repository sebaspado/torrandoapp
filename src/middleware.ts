export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/tasks', '/tasks/:path*', '/dashboard/:path*']  // Added /tasks
}; 