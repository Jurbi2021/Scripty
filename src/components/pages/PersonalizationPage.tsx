// src/components/pages/PersonalizationPage.tsx
import React from 'react';
import DashboardLayout from '../templates/DashboardLayout';
import PersonalizationPanel from '../organisms/PersonalizationPanel';
import ProfileThresholdGuide from '../organisms/ProfileThresholdGuide';
import ContentProfileSelector from '../molecules/ContentProfileSelector';
import styles from './PersonalizationPage.module.scss';
import Text from '../atoms/Text';

const PersonalizationPage: React.FC = () => {
  return (
    <DashboardLayout headerTitle="Personalização e Perfis">
      <div className={styles.page}>
        <Text as="h1" size="large" weight="bold" className={styles.pageTitle}>
          Personalização e Perfis
        </Text>
        <Text as="p" className={styles.pageDescription}>
          Ajuste as métricas visíveis e selecione um perfil de conteúdo para adaptar a análise do Scripty ao seu tipo de texto.
        </Text>

        {/* <<< MUDANÇA NO LAYOUT >>> */}
        <div className={styles.panelsContainer}>
          
          {/* Coluna da Esquerda: O que exibir */}
          <div className={styles.panelWrapper}>
            <Text as="h3" size="large" weight="semibold" className={styles.panelTitle}>
              Métricas Visíveis
            </Text>
            <PersonalizationPanel />
          </div>

          {/* Coluna da Direita: Como analisar */}
          <div className={styles.rightColumn}>
            <div className={styles.panelWrapper}>
              <Text as="h3" size="large" weight="semibold" className={styles.panelTitle}>
                Selecionar Perfil de Conteúdo
              </Text>
              <ContentProfileSelector />
            </div>
            <div className={styles.panelWrapper}>
              <Text as="h3" size="large" weight="semibold" className={styles.panelTitle}>
                Guia do Perfil Ativo
              </Text>
              <ProfileThresholdGuide />
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default PersonalizationPage;