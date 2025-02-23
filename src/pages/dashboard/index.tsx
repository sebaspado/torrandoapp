import React from 'react';
import { useSession } from 'next-auth/react';
import ProtectedLayout from '@/components/ProtectedLayout/ProtectedLayout';
import styles from './dashboard.module.scss';

const DashboardPage = () => {
  const { data: session } = useSession();

  return (
    <ProtectedLayout>
      <div className={styles.container}>
        <h1>Welcome, {session?.user?.name || 'User'}!</h1>
        <div className={styles.stats}>
          {/* Add dashboard content here */}
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default DashboardPage; 