import React from 'react';
import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'var(--success)' }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={styles.progressContainer}>
      <div 
        className={styles.progressBar}
        style={{ 
          width: `${clampedProgress}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}40`
        }}
      />
      <span className={styles.progressText}>{Math.round(clampedProgress)}%</span>
    </div>
  );
};

export default ProgressBar; 