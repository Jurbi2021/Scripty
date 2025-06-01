// src/components/organisms/PersonalizationPanel.tsx
import React, { useState, useEffect } from 'react';
import styles from './PersonalizationPanel.module.scss';
import { motion } from 'framer-motion';
import Toggle from '../atoms/Toggle'; //
import Button from '../atoms/Button'; // Seu átomo de botão
import Text from '../atoms/Text';   // Seu átomo de texto
import { useEditor } from '../../contexts/EditorContext'; //
import {
  ScriptyPreferences,
  BasicMetricKey,
  ReadabilityIndexKey,
  StyleMetricKey,
  SeoMetricKey,
  DetailLevel,
  defaultScriptyPreferences
} from '../../utils/preferences';

// Dados para os toggles (para evitar repetição no JSX)
// Você pode buscar os nomes das métricas dos seus arquivos de utils se preferir
const basicMetricsOptions: { key: BasicMetricKey; label: string }[] = [
  { key: 'charsWithSpaces', label: 'Caracteres' },
  { key: 'charsNoSpaces', label: 'Caracteres (s/ espaço)' },
  { key: 'words', label: 'Palavras' },
  { key: 'sentences', label: 'Sentenças' },
  { key: 'paragraphs', label: 'Parágrafos' },
  { key: 'readingTime', label: 'Tempo de Leitura' },
  { key: 'uniqueWords', label: 'Palavras Únicas' },
  { key: 'avgWordsPerSentence', label: 'Média Palavras/Sentença' },
  { key: 'avgCharsPerWord', label: 'Média Caracteres/Palavra' },
];

const readabilityIndicesOptions: { key: ReadabilityIndexKey; label: string }[] = [
  { key: 'jurbiX', label: 'JurbiX' },
  { key: 'fleschKincaidReadingEase', label: 'Flesch-Kincaid' },
  { key: 'gunningFog', label: 'Gunning Fog' },
  { key: 'smogIndex', label: 'SMOG' },
  { key: 'colemanLiauIndex', label: 'Coleman-Liau' },
];

const styleMetricsOptions: { key: StyleMetricKey; label: string; hasDetails?: boolean }[] = [
  { key: 'passiveVoice', label: 'Voz Passiva', hasDetails: true },
  { key: 'adverbs', label: 'Advérbios' },
  { key: 'complexSentences', label: 'Frases Complexas', hasDetails: true },
  { key: 'discourseConnectors', label: 'Conectores Discursivos' },
  { key: 'lexicalDiversity', label: 'Diversidade Léxica' },
];

const seoMetricsOptions: { key: SeoMetricKey; label: string }[] = [
  { key: 'mainKeyword', label: 'Palavra-Chave Principal' },
  { key: 'lsiResult', label: 'Densidade LSI' },
  { key: 'seoReadability', label: 'Legibilidade para SEO' },
  { key: 'seoTextLength', label: 'Comprimento do Texto (SEO)' },
  { key: 'headingResult', label: 'Estrutura Textual' },
];


const PersonalizationPanel: React.FC = () => {
  const { preferences, updatePreferences, resetPreferences } = useEditor();
  // Estado local para gerenciar as mudanças antes de salvar, se preferir um "save" explícito
  const [localPrefs, setLocalPrefs] = useState<ScriptyPreferences>(preferences);
    // Sincronizar localPrefs se as preferences globais mudarem (ex: reset externo)
  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

const handleToolbarMetricVisibilityToggle = (metricKey: BasicMetricKey) => {
    setLocalPrefs(prev => {
      const newVisibleMetrics = [...prev.toolbar.visibleMetrics];
      const itemIndex = newVisibleMetrics.indexOf(metricKey);

      if (itemIndex > -1) {
        newVisibleMetrics.splice(itemIndex, 1); // Remove se já existe (desativa)
      } else {
        // Adiciona, respeitando a ordem de allBasicMetricsOptions para novos itens,
        // ou simplesmente no final se a ordem inicial não for crítica aqui.
        // Para manter uma ordem previsível ao adicionar, poderíamos adicionar no final.
        newVisibleMetrics.push(metricKey);
      }
      return {
        ...prev,
        toolbar: {
          ...prev.toolbar,
          visibleMetrics: newVisibleMetrics,
        },
      };
    });
  };

  // Função para mover uma métrica na lista de métricas visíveis da toolbar
  const handleMoveToolbarMetric = (metricKey: BasicMetricKey, direction: 'up' | 'down') => {
    setLocalPrefs(prev => {
      const currentVisibleMetrics = [...prev.toolbar.visibleMetrics];
      const index = currentVisibleMetrics.indexOf(metricKey);

      if (index === -1) return prev; // Métrica não está visível, não faz nada

      if (direction === 'up' && index > 0) {
        // Troca com o elemento anterior
        [currentVisibleMetrics[index - 1], currentVisibleMetrics[index]] = [currentVisibleMetrics[index], currentVisibleMetrics[index - 1]];
      } else if (direction === 'down' && index < currentVisibleMetrics.length - 1) {
        // Troca com o elemento seguinte
        [currentVisibleMetrics[index + 1], currentVisibleMetrics[index]] = [currentVisibleMetrics[index], currentVisibleMetrics[index + 1]];
      }

      return {
        ...prev,
        toolbar: {
          ...prev.toolbar,
          visibleMetrics: currentVisibleMetrics,
        },
      };
    });
  };


  const handleToggle = (category: keyof ScriptyPreferences, key: string, subKey?: string) => {
    setLocalPrefs(prev => {
      const newPrefs = JSON.parse(JSON.stringify(prev)); // Deep copy para evitar mutação
      if (subKey) {
        // @ts-ignore // Lidar com tipos dinâmicos aqui pode ser complexo
        newPrefs[category][key][subKey] = !newPrefs[category][key][subKey];
      } else if (category === 'toolbar' && key === 'visibleMetrics') {
        // Tratamento especial para array de visibleMetrics na toolbar
        const metricKey = subKey as BasicMetricKey; // subKey aqui seria a métrica
        const currentVisible = newPrefs.toolbar.visibleMetrics as BasicMetricKey[];
        if (currentVisible.includes(metricKey)) {
          newPrefs.toolbar.visibleMetrics = currentVisible.filter(m => m !== metricKey);
        } else {
          newPrefs.toolbar.visibleMetrics = [...currentVisible, metricKey];
        }
      } else if (category === 'advancedMetrics' && key === 'visibleReadabilityIndices') {
        const indexKey = subKey as ReadabilityIndexKey;
        const currentVisible = newPrefs.advancedMetrics.visibleReadabilityIndices as ReadabilityIndexKey[];
        if (currentVisible.includes(indexKey)) {
          newPrefs.advancedMetrics.visibleReadabilityIndices = currentVisible.filter(m => m !== indexKey);
        } else {
          newPrefs.advancedMetrics.visibleReadabilityIndices = [...currentVisible, indexKey];
        }
      }
      else {
         // @ts-ignore
        newPrefs[category][key] = !newPrefs[category][key];
      }
      return newPrefs;
    });
  };

  const handleDetailLevelChange = (styleKey: StyleMetricKey, level: DetailLevel) => {
    setLocalPrefs(prev => {
      const newPrefs = JSON.parse(JSON.stringify(prev));
      if (newPrefs.styleAnalysis[styleKey]) {
        newPrefs.styleAnalysis[styleKey]!.detailLevel = level;
      }
      return newPrefs;
    });
  };

  // Função para lidar com o toggle de métricas que são arrays (como toolbar.visibleMetrics)
  const handleArrayToggle = (
    category: 'toolbar' | 'advancedMetrics',
    listKey: 'visibleMetrics' | 'visibleReadabilityIndices',
    itemKey: BasicMetricKey | ReadabilityIndexKey
  ) => {
    setLocalPrefs(prev => {
      const newPrefs = JSON.parse(JSON.stringify(prev)); // Deep copy
      const currentList = newPrefs[category][listKey] as Array<BasicMetricKey | ReadabilityIndexKey>;
      const itemIndex = currentList.indexOf(itemKey);

      if (itemIndex > -1) {
        currentList.splice(itemIndex, 1); // Remove
      } else {
        currentList.push(itemKey); // Adiciona
      }
      newPrefs[category][listKey] = currentList;
      return newPrefs;
    });
  };


  const handleSavePreferences = () => {
    // Para uma atualização profunda, pode ser necessário fazer um merge mais cuidadoso
    // ou garantir que updatePreferences lide com a estrutura aninhada.
    // A implementação atual de updatePreferences no EditorContext já tenta um merge aninhado simples.
    updatePreferences(localPrefs);
    // Adicionar feedback ao usuário (ex: toast, mensagem)
  };

  const handleResetPreferences = () => {
    setLocalPrefs(defaultScriptyPreferences);
    resetPreferences(); // Isso vai resetar no contexto e localStorage
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" }
    })
  };

  return (
    <div className={styles.personalizationContainer}>
      <motion.div
        className={styles.settingsSection} // Renomeado para metricsCustomizationSection ou similar
        custom={0}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Text as="h2" className={styles.sectionTitle}>Personalizar Métricas Visíveis</Text>

        {/* Toolbar de Métricas Básicas */}
        <div className={styles.preferenceCategory}>
          <Text as="h3" className={styles.categoryTitle}>Barra de Métricas Básicas (Toolbar)</Text>
          {basicMetricsOptions.map(opt => (
            <div key={opt.key} className={styles.toggleItem}>
              <Text size="medium">{opt.label}</Text>
              <Toggle
                isOn={localPrefs.toolbar.visibleMetrics.includes(opt.key)}
                onToggle={() => handleArrayToggle('toolbar', 'visibleMetrics', opt.key)}
                ariaLabel={`Mostrar/ocultar ${opt.label} na toolbar`}
              />
            </div>
          ))}
        </div>

        {/* Painel de Métricas Avançadas */}
        <div className={styles.preferenceCategory}>
          <Text as="h3" className={styles.categoryTitle}>Painel de Métricas Avançadas</Text>
          <div className={styles.toggleItem}>
            <Text size="medium">Card de Comprimento do Texto</Text>
            <Toggle isOn={localPrefs.advancedMetrics.showLengthCard} onToggle={() => handleToggle('advancedMetrics', 'showLengthCard')} />
          </div>
          <div className={styles.toggleItem}>
            <Text size="medium">Card de Redundância</Text>
            <Toggle isOn={localPrefs.advancedMetrics.showRedundancyCard} onToggle={() => handleToggle('advancedMetrics', 'showRedundancyCard')} />
          </div>
          <div className={styles.toggleItem}>
            <Text size="medium">Card de Análise de Sentimento</Text>
            <Toggle isOn={localPrefs.advancedMetrics.showSentimentCard} onToggle={() => handleToggle('advancedMetrics', 'showSentimentCard')} />
          </div>
          <div className={styles.toggleItem}>
            <Text size="medium">Carrossel de Índices de Legibilidade</Text>
            <Toggle isOn={localPrefs.advancedMetrics.showReadabilityCarousel} onToggle={() => handleToggle('advancedMetrics', 'showReadabilityCarousel')} />
          </div>
          {localPrefs.advancedMetrics.showReadabilityCarousel && (
            <div className={styles.subCategory}>
              <Text as="h4" className={styles.subCategoryTitle}>Índices de Legibilidade Visíveis no Carrossel:</Text>
              {readabilityIndicesOptions.map(opt => (
                <div key={opt.key} className={styles.toggleItemCompact}>
                  <Text size="small">{opt.label}</Text>
                  <Toggle
                    isOn={localPrefs.advancedMetrics.visibleReadabilityIndices.includes(opt.key)}
                    onToggle={() => handleArrayToggle('advancedMetrics', 'visibleReadabilityIndices', opt.key)}
                    ariaLabel={`Mostrar/ocultar ${opt.label} no carrossel de legibilidade`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Painel de Análise de Estilo */}
        <div className={styles.preferenceCategory}>
          <Text as="h3" className={styles.categoryTitle}>Painel de Análise de Estilo</Text>
          {styleMetricsOptions.map(opt => (
            <div key={opt.key} className={styles.toggleCard}>
              <div className={styles.toggleItem}>
                <Text size="medium">{opt.label}</Text>
                <Toggle
                  isOn={localPrefs.styleAnalysis[opt.key]?.showCard ?? false}
                  // @ts-ignore
                  onToggle={() => setLocalPrefs(prev => ({...prev, styleAnalysis: {...prev.styleAnalysis, [opt.key]: {...prev.styleAnalysis[opt.key], showCard: !prev.styleAnalysis[opt.key]?.showCard }}}))}
                  ariaLabel={`Mostrar/ocultar card de ${opt.label}`}
                />
              </div>
              {(localPrefs.styleAnalysis[opt.key]?.showCard && opt.hasDetails) && (
                <div className={styles.detailPreference}>
                  <Text size="small">Nível de Detalhe:</Text>
                  <select
                    value={localPrefs.styleAnalysis[opt.key]?.detailLevel}
                    onChange={(e) => handleDetailLevelChange(opt.key, e.target.value as DetailLevel)}
                    className={styles.selectDropdown}
                  >
                    <option value="details_collapsed">Mostrar Detalhes (Recolhido)</option>
                    <option value="details_expanded">Mostrar Detalhes (Expandido)</option>
                    <option value="summary">Apenas Resumo</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Painel de Análise de SEO */}
        <div className={styles.preferenceCategory}>
          <Text as="h3" className={styles.categoryTitle}>Painel de Análise de SEO</Text>
          {seoMetricsOptions.map(opt => (
            <div key={opt.key} className={styles.toggleItem}>
              <Text size="medium">{opt.label}</Text>
              <Toggle
                isOn={localPrefs.seoAnalysis[opt.key as keyof SeoAnalysisPreferences]?.showCard ?? false}
                 // @ts-ignore
                onToggle={() => setLocalPrefs(prev => ({...prev, seoAnalysis: {...prev.seoAnalysis, [opt.key]: {...prev.seoAnalysis[opt.key], showCard: !prev.seoAnalysis[opt.key]?.showCard }}}))}
                ariaLabel={`Mostrar/ocultar card de ${opt.label}`}
              />
            </div>
          ))}
        </div>

        <div className={styles.actionButtons}>
            <Button onClick={handleSavePreferences} variant="primary" className={styles.confirmButton}>
                Salvar Preferências
            </Button>
            <Button onClick={handleResetPreferences} variant="secondary" className={styles.resetButton}>
                Restaurar Padrões
            </Button>
        </div>
      </motion.div>

      {/* A seção de Tema do Scripty original pode ser removida se o foco não é em cores
          ou mantida se você planeja adicionar personalização de tema no futuro.
          Por enquanto, vou omiti-la conforme sua indicação de focar em métricas.
      */}
    </div>
  );
};

export default PersonalizationPanel;