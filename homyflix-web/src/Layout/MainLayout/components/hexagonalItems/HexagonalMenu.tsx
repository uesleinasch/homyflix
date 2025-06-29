import styles from "../../style.module.css";

const HexagonMenuItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
  }> = ({ icon, label, onClick, active }) => {
    return (
      <div className={styles.hexagonWrapper} onClick={onClick}>
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