import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './ProtectedLayout.module.scss';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        {children}
      </main>
      <div id="modal-portal" />
    </div>
  );
};

export default ProtectedLayout; 