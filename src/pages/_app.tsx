import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { TaskProvider } from '@/contexts/TaskContext';
import { ModalProvider } from '@/components/ModalProvider/ModalProvider';

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <TaskProvider>
        <ModalProvider>
          <Component {...pageProps} />
        </ModalProvider>
      </TaskProvider>
    </SessionProvider>
  );
} 