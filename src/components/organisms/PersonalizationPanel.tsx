// src/components/organisms/PersonalizationPanel.tsx
import React, { useState, useEffect } from 'react';
import styles from './PersonalizationPanel.module.scss';
import { motion } from 'framer-motion';
import Toggle from '../atoms/Toggle';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import { useEditor } from '../../contexts/EditorContext';
import {
  ScriptyPreferences,
  BasicMetricKey,
  ReadabilityIndexKey,
  StyleMetricKey,
  SeoMetricKey,
  DetailLevel,
  SeoAnalysisPreferences,
  // Os tipos de sub-preferências podem ser úteis para os handlers se você quiser mais especificidade
  // ToolbarPreferences, AdvancedMetricsPreferences, StyleAnalysisPreferences, SeoAnalysisPreferences
} from '../../utils/preferences'; // Ajuste o caminho conforme necessário

// --- Definições das Opções de Métricas (conforme já definimos antes) ---
const allBasicMetricsOptions: { key: BasicMetricKey; label: string }[] = [
  { key: 'words', label: 'Palavras' }, { key: 'charsWithSpaces', label: 'Caracteres' },
  { key: 'sentences', label: 'Sentenças' }, { key: 'paragraphs', label: 'Parágrafos' },
  { key: 'readingTime', label: 'Tempo de Leitura' }, { key: 'uniqueWords', label: 'Palavras Únicas' },
  { key: 'avgWordsPerSentence', label: 'Média Palavras/Sentença' },
  { key: 'avgCharsPerWord', label: 'Média Caracteres/Palavra' }, { key: 'charsNoSpaces', label: 'Caracteres (s/ espaço)' },
];
const allReadabilityIndicesOptions: { key: ReadabilityIndexKey; label: string }[] = [
  { key: 'jurbiX', label: 'JurbiX' }, { key: 'fleschKincaidReadingEase', label: 'Flesch-Kincaid' },
  { key: 'gunningFog', label: 'Gunning Fog' }, { key: 'smogIndex', label: 'SMOG' },
  { key: 'colemanLiauIndex', label: 'Coleman-Liau' }, { key: 'gulpeaseIndex', label: 'Gulpease' }
];
const allStyleMetricsOptions: { key: StyleMetricKey; label: string; hasDetails?: boolean }[] = [
  { key: 'passiveVoice', label: 'Voz Passiva', hasDetails: true }, { key: 'adverbs', label: 'Advérbios' },
  { key: 'complexSentences', label: 'Frases Complexas', hasDetails: true },
  { key: 'discourseConnectors', label: 'Conectores Discursivos' }, { key: 'lexicalDiversity', label: 'Diversidade Léxica' },
];
const allSeoMetricsOptions: { key: SeoMetricKey; label: string }[] = [
  { key: 'mainKeyword', label: 'Palavra-Chave Principal' }, { key: 'lsiResult', label: 'Densidade LSI' },
  { key: 'seoReadability', label: 'Legibilidade para SEO' }, { key: 'seoTextLength', label: 'Comprimento do Texto (SEO)' },
  { key: 'headingResult', label: 'Estrutura Textual' },
];
// --- Fim das Definições ---

const PersonalizationPanel: React.FC = () => {
  const { preferences, updatePreferences, resetPreferences } = useEditor();
  const [localPrefs, setLocalPrefs] = useState<ScriptyPreferences>(preferences);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  // Suas funções de handle (handleToggle, handleArrayToggle, etc.) permanecem as mesmas
 const handleToolbarMetricVisibilityToggle = (metricKey: BasicMetricKey) => {
    setLocalPrefs(prev => {
      const currentVisible = prev.toolbar.visibleMetrics;
      const newVisibleMetrics = currentVisible.includes(metricKey)
        ? currentVisible.filter(m => m !== metricKey)
        : [...currentVisible, metricKey];
      return { ...prev, toolbar: { ...prev.toolbar, visibleMetrics: newVisibleMetrics } };
    });
  };
  const handleMoveToolbarMetric = (metricKey: BasicMetricKey, direction: 'up' | 'down') => {
    setLocalPrefs(prev => {
      const currentVisibleMetrics = [...prev.toolbar.visibleMetrics];
      const index = currentVisibleMetrics.indexOf(metricKey);
      if (index === -1) return prev;
      if (direction === 'up' && index > 0) {
        [currentVisibleMetrics[index - 1], currentVisibleMetrics[index]] = [currentVisibleMetrics[index], currentVisibleMetrics[index - 1]];
      } else if (direction === 'down' && index < currentVisibleMetrics.length - 1) {
        [currentVisibleMetrics[index + 1], currentVisibleMetrics[index]] = [currentVisibleMetrics[index], currentVisibleMetrics[index + 1]];
      }
      return { ...prev, toolbar: { ...prev.toolbar, visibleMetrics: currentVisibleMetrics } };
    });
  };

  // --- Handlers Genéricos e Específicos ---
  const handleSimpleToggle = <C extends keyof Omit<ScriptyPreferences, 'toolbar' | 'styleAnalysis' | 'aiPromptSettings' | 'advancedMetrics'>, K extends keyof ScriptyPreferences[C]>(category: C, key: K) => {
    // Este handler genérico precisa ser ajustado para lidar com a estrutura de cada preferência.
    // Ou criar handlers específicos para cada categoria como abaixo.
  };

  const handleAdvancedMetricToggle = (key: keyof Omit<ScriptyPreferences['advancedMetrics'], 'visibleReadabilityIndices'>) => {
    setLocalPrefs(prev => ({
      ...prev,
      advancedMetrics: { ...prev.advancedMetrics, [key]: !prev.advancedMetrics[key] }
    }));
  };

  const handleReadabilityIndexToggle = (indexKey: ReadabilityIndexKey) => {
    setLocalPrefs(prev => {
      const currentVisible = prev.advancedMetrics.visibleReadabilityIndices;
      const newVisible = currentVisible.includes(indexKey)
        ? currentVisible.filter(k => k !== indexKey)
        : [...currentVisible, indexKey];
      return { ...prev, advancedMetrics: { ...prev.advancedMetrics, visibleReadabilityIndices: newVisible } };
    });
  };

  const handleStyleCardToggle = (styleKey: StyleMetricKey) => {
    setLocalPrefs(prev => ({
      ...prev,
      styleAnalysis: { ...prev.styleAnalysis, [styleKey]: { ...prev.styleAnalysis[styleKey], showCard: !prev.styleAnalysis[styleKey].showCard } }
    }));
  };

  const handleStyleDetailLevelChange = (styleKey: StyleMetricKey, level: DetailLevel) => {
    setLocalPrefs(prev => ({
      ...prev,
      styleAnalysis: { ...prev.styleAnalysis, [styleKey]: { ...prev.styleAnalysis[styleKey], detailLevel: level } }
    }));
  };

  const handleSeoCardToggle = (seoKey: SeoMetricKey) => {
    setLocalPrefs(prev => ({
      ...prev,
      seoAnalysis: { ...prev.seoAnalysis, [seoKey]: { ...prev.seoAnalysis[seoKey], showCard: !prev.seoAnalysis[seoKey].showCard } }
    }));
  };

  // --- NOVO HANDLER para o toggle de generateComprehensivePrompt ---
  const handleToggleComprehensivePrompt = () => {
    setLocalPrefs(prev => ({
      ...prev,
      aiPromptSettings: {
        ...prev.aiPromptSettings,
        generateComprehensivePrompt: !prev.aiPromptSettings.generateComprehensivePrompt,
      },
    }));
  };
  
  const handleSavePreferences = () => {
    setSaveStatus('saving');
    updatePreferences(localPrefs);
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500); 
    }, 700);
  };

  const handleResetPreferences = () => {
    resetPreferences(); // O useEffect sincronizará localPrefs
  };

  const sectionVariants = { /* ... (suas variantes, se houver) ... */ };

  return (
    <div className={styles.personalizationContainer}>
      <motion.div
        className={styles.settingsSection}
        custom={0} variants={sectionVariants} initial="hidden" animate="visible"
      >
        <Text as="h2" className={styles.sectionTitle}>Personalizar Exibição de Métricas</Text>

        {/* Toolbar de Métricas Básicas */}
        <div className={styles.preferenceCategory}>
          <Text as="h3" className={styles.categoryTitle}>Barra de Métricas Básicas (Toolbar)</Text>
          <Text as="p" className={styles.categoryDescription}>
            Selecione quais métricas básicas deseja ver na barra de ferramentas e defina sua ordem.
          </Text>
          <div className={styles.visibilityList}>
            <Text as="h4" className={styles.subCategoryTitle}>Ativar/Desativar Métricas na Toolbar:</Text>
            {allBasicMetricsOptions.map(opt => (
              <div key={`toggle-${opt.key}`} className={styles.toggleItem}>
                <Text size="medium">{opt.label}</Text>
                <Toggle
                  isOn={localPrefs.toolbar.visibleMetrics.includes(opt.key)}
                  onToggle={() => handleToolbarMetricVisibilityToggle(opt.key)}
                  ariaLabel={`Mostrar/ocultar ${opt.label} na toolbar`}
                />
              </div>
            ))}
          </div>
          {/* A reordenação foi adiada para v2, então a seção de reorderList não está aqui por agora */}
        </div>

        {/* Painel de Métricas Avançadas */}
        <div className={styles.preferenceCategory}>
          <Text as="h3" className={styles.categoryTitle}>Painel de Métricas Avançadas</Text>
          <div className={styles.toggleItem}><Text size="medium">Card de Comprimento do Texto</Text><Toggle isOn={localPrefs.advancedMetrics.showLengthCard} onToggle={() => handleAdvancedMetricToggle('showLengthCard')} /></div>
          <div className={styles.toggleItem}><Text size="medium">Card de Redundância</Text><Toggle isOn={localPrefs.advancedMetrics.showRedundancyCard} onToggle={() => handleAdvancedMetricToggle('showRedundancyCard')} /></div>
          <div className={styles.toggleItem}><Text size="medium">Card de Análise de Sentimento</Text><Toggle isOn={localPrefs.advancedMetrics.showSentimentCard} onToggle={() => handleAdvancedMetricToggle('showSentimentCard')} /></div>
          <div className={styles.toggleItem}><Text size="medium">Carrossel de Índices de Legibilidade</Text><Toggle isOn={localPrefs.advancedMetrics.showReadabilityCarousel} onToggle={() => handleAdvancedMetricToggle('showReadabilityCarousel')} /></div>
          {localPrefs.advancedMetrics.showReadabilityCarousel && (
            <div className={styles.subCategory}>
              <Text as="h4" className={styles.subCategoryTitle}>Índices Visíveis no Carrossel:</Text>
              {allReadabilityIndicesOptions.map(opt => (
                <div key={opt.key} className={styles.toggleItemCompact}><Text size="small">{opt.label}</Text><Toggle isOn={localPrefs.advancedMetrics.visibleReadabilityIndices.includes(opt.key)} onToggle={() => handleReadabilityIndexToggle(opt.key)} /></div>
              ))}
            </div>
          )}
        </div>

        {/* Painel de Análise de Estilo */}
        <div className={styles.preferenceCategory}>
          <Text as="h3" className={styles.categoryTitle}>Painel de Análise de Estilo</Text>
          {allStyleMetricsOptions.map(opt => (
            <div key={opt.key} className={styles.toggleCard}>
              <div className={styles.toggleItem}><Text size="medium">{opt.label}</Text><Toggle isOn={localPrefs.styleAnalysis[opt.key]?.showCard ?? false} onToggle={() => handleStyleCardToggle(opt.key)} /></div>
              {(localPrefs.styleAnalysis[opt.key]?.showCard && opt.hasDetails) && (
                <div className={styles.detailPreference}>
                  <Text size="small">Nível de Detalhe:</Text>
                  <select value={localPrefs.styleAnalysis[opt.key]?.detailLevel} onChange={(e) => handleStyleDetailLevelChange(opt.key, e.target.value as DetailLevel)} className={styles.selectDropdown} aria-label={`Nível de detalhe para ${opt.label}`}>
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
          {allSeoMetricsOptions.map(opt => (
            <div key={opt.key} className={styles.toggleItem}><Text size="medium">{opt.label}</Text><Toggle isOn={localPrefs.seoAnalysis[opt.key as keyof SeoAnalysisPreferences]?.showCard ?? false} onToggle={() => handleSeoCardToggle(opt.key as SeoMetricKey)} /></div>
          ))}
        </div>

        {/* --- NOVA SEÇÃO PARA CONFIGURAÇÕES DO PROMPT DE IA --- */}
        <div className={styles.preferenceCategory}>
          <Text as="h3" className={styles.categoryTitle}>Configurações do Prompt de IA</Text>
          <div className={styles.toggleItem}>
            <Text size="medium">Gerar prompt abrangente (incluir feedbacks de todas as análises)</Text>
            <Toggle
              isOn={localPrefs.aiPromptSettings.generateComprehensivePrompt}
              onToggle={handleToggleComprehensivePrompt}
              ariaLabel="Ativar ou desativar prompt de IA abrangente"
            />
          </div>
          <Text as="p" size="small" className={styles.categoryDescription} style={{marginTop: '0.5rem'}}>
            Se desativado, o prompt de IA será focado apenas nos feedbacks da tela de análise ativa.
          </Text>
        </div>
        {/* --- FIM DA NOVA SEÇÃO --- */}

        <div className={styles.actionButtons}>
            <Button onClick={handleSavePreferences} variant="primary" className={styles.confirmButton}>Salvar Preferências</Button>
            <Button onClick={handleResetPreferences} variant="secondary" className={styles.resetButton}>Restaurar Padrões</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalizationPanel;