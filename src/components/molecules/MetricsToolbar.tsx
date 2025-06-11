// src/components/molecules/MetricsToolbar.tsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import styles from './MetricsToolbar.module.scss';
import { BasicMetricsData } from '../../utils/BasicMetrics'; // Adicionar BasicMetricKey
import { useEditor } from '../../contexts/EditorContext'; // Importar o hook do contexto
import {BasicMetricKey} from '../../utils/preferences'

// A ordem e labels das métricas básicas que podem ser exibidas
const allBasicMetricsOptions: { key: BasicMetricKey; label: string }[] = [
  { key: 'charsWithSpaces', label: 'Caracteres' },
  { key: 'charsNoSpaces', label: 'Caracteres (s/ espaço)' },
  { key: 'words', label: 'Palavras' },
  { key: 'sentences', label: 'Sentenças' },
  { key: 'paragraphs', label: 'Parágrafos' },
  { key: 'readingTime', label: 'Tempo Leitura' },
  { key: 'uniqueWords', label: 'Palavras Únicas' },
  { key: 'avgWordsPerSentence', label: 'Média Palavras/Sentença' },
  { key: 'avgCharsPerWord', label: 'Média Caracteres/Palavra' },
];

interface MetricsToolbarProps {
  metrics: BasicMetricsData; // As métricas calculadas atualmente
}

const MetricsToolbar: React.FC<MetricsToolbarProps> = ({ metrics }) => {
  const { preferences } = useEditor(); // Aceder às preferências do usuário

  // Filtrar as métricas que devem ser exibidas com base nas preferências do usuário
  // e manter a ordem original de allBasicMetricsOptions.
  const metricsToDisplay = allBasicMetricsOptions.filter(metricOption =>
    preferences.toolbar.visibleMetrics.includes(metricOption.key)
  );

  // Se não houver métricas selecionadas para exibir OU se a toolbar estiver explicitamente desativada
  // (assumindo que 'showToolbar' é uma preferência que você pode adicionar depois)
  // if (!preferences.toolbar.showToolbar || metricsToDisplay.length === 0) {
  //   return null; // Ou um placeholder, se preferir
  // }
  if (metricsToDisplay.length === 0) {
      return null; // Não renderiza nada se nenhuma métrica estiver visível
  }

  return (
    <div className={styles.toolbarContainer}>
      <Swiper
        modules={[FreeMode, Mousewheel]}
        slidesPerView={'auto'}
        spaceBetween={12}
        freeMode={true}
        mousewheel={true}
        className={styles.metricsSwiper}
      >
        {metricsToDisplay.map(({ key, label }) => (
          <SwiperSlide key={key} className={styles.metricSlide}>
            <div className={styles.metricCard}>
              <span className={styles.metricName}>{label}</span>
              <span className={styles.metricValue}>{metrics ? metrics[key] : '0'}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MetricsToolbar;