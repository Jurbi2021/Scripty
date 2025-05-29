import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import styles from './MetricsToolbar.module.scss';
import { BasicMetricsData } from '../../utils/basicmetrics'; // Assuming path is correct

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

// Define the structure and order for basic metrics display (can be kept here or passed as prop)
const basicMetricDisplayOrder: { key: keyof BasicMetricsData; label: string }[] = [
  { key: 'words', label: 'Palavras' },
  { key: 'charsWithSpaces', label: 'Caracteres' },
  { key: 'sentences', label: 'Sentenças' },
  { key: 'paragraphs', label: 'Parágrafos' },
  { key: 'readingTime', label: 'Tempo Leitura' },
  { key: 'uniqueWords', label: 'Palavras Únicas' },
  { key: 'avgWordsPerSentence', label: 'Média Palavras/Sentença' },
  { key: 'avgCharsPerWord', label: 'Média Caracteres/Palavra' },
  { key: 'charsNoSpaces', label: 'Caracteres (s/ espaço)' },
];

interface MetricsToolbarProps {
  metrics: BasicMetricsData;
}

const MetricsToolbar: React.FC<MetricsToolbarProps> = ({ metrics }) => {
  return (
    <div className={styles.toolbarContainer}> {/* Renamed class for clarity */}
      <Swiper
        modules={[FreeMode, Mousewheel]}
        slidesPerView={'auto'}
        spaceBetween={12}
        freeMode={true}
        mousewheel={true}
        className={styles.metricsSwiper}
      >
        {basicMetricDisplayOrder.map(({ key, label }) => (
          <SwiperSlide key={key} className={styles.metricSlide}>
            <div className={styles.metricCard}>
              <span className={styles.metricName}>{label}</span>
              {/* Ensure metrics object is available before accessing keys */}
              <span className={styles.metricValue}>{metrics ? metrics[key] : '0'}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MetricsToolbar;

