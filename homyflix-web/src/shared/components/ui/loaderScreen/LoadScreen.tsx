/**
 * Componente de tela de carregamento que ocupa 100% da aplicação
 * 
 * @param isLoading - Controla se o loader deve ser exibido (padrão: true)
 * @param loadingText - Texto customizado para exibir durante o carregamento
 * @returns JSX.Element | null
 */
import React, { memo } from 'react';
import { Loader } from '@mantine/core';
import styles from './LoadScreen.module.css';
import type { LoadScreenProps } from './loadscreen';

const LoadScreen: React.FC = memo<LoadScreenProps>(({ 
  isLoading = true, 
  loadingText = "Carregando..." 
}) => {
  // Não renderiza nada se não estiver carregando
  if (!isLoading) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      aria-label="Carregando aplicação"
      role="progressbar"
      aria-busy="true"
    >
      <div className={styles.container}>
        <Loader color="orange" size="xl" type="dots" />
        <span className={styles.text}>
          {loadingText}
        </span>
      </div>
    </div>
  );
});

LoadScreen.displayName = 'LoadScreen';

export default LoadScreen;