'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.mobileHeader}>
        <button 
          className={styles.hamburger}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
        </button>
        <h1>Task Manager</h1>
      </div>

      <div className={`${styles.sidebar} ${!isSidebarOpen ? styles.hidden : ''}`}>
        <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
      </div>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout; 