import React from "react";
import { useTheme } from "../../../../shared/hooks/useTheme";
import styles from "../../style.module.css";

const HexagonMenuItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
  }> = ({ icon, label, onClick, active }) => {
    const { isDark } = useTheme();
    
    return (
      <div 
        className={styles.hexagonWrapper} 
        onClick={onClick}
        data-theme={isDark ? 'dark' : 'light'}
      >
        <div className={`${styles.hexagon} ${active ? styles.hexagonActive : ''}`}>
          <div className={styles.hexagonContent}>
            <div className={styles.hexagonIcon}>
              {icon}
            </div>
            <div className={styles.hexagonLabel}>
              {label}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default HexagonMenuItem;