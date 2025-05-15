import React from 'react';
import Text from '../atoms/Text';
import styles from './MetricsSummary.module.scss';

interface Metric {
  name: string;
  value: string;
}

interface MetricsSummaryProps {
  metrics: Metric[];
}

const MetricsSummary: React.FC<MetricsSummaryProps> = ({ metrics }) => {
  return (
    <div className={styles.metricsSummary}>
      {metrics.map((metric) => (
        <div key={metric.name} className={styles.metric}>
          <Text size="medium" weight="normal" className={styles.name}>
            {metric.name}
          </Text>
          <Text size="large" weight="bold" className={styles.value}>
            {metric.value}
          </Text>
        </div>
      ))}
    </div>
  );
};

export default MetricsSummary;