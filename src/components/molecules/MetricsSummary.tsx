// src/components/molecules/MetricsSummary.tsx
import React from 'react';
import Text from '../atoms/Text';
import styles from './MetricsSummary.module.scss';

interface Metric {
  name: string;
  value: string | number;
}

interface MetricsSummaryProps {
  metrics: Metric[];
  className?: string; // Adicionar className
}

const MetricsSummary: React.FC<MetricsSummaryProps> = ({ metrics, className = '' }) => {
  return (
    <div className={`${styles.metricsSummary} ${className}`}>
      {metrics.map((metric) => (
        <div key={metric.name} className={styles.metric}>
          <Text size="small" weight="semibold" className={styles.name} as="dt"> {/* Usar dt para semântica */}
            {metric.name}
          </Text>
          <Text size="large" weight="bold" className={styles.value} as="dd"> {/* Usar dd para semântica */}
            {metric.value.toString()}
          </Text>
        </div>
      ))}
    </div>
  );
};

export default MetricsSummary;