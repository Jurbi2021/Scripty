// src/components/organisms/Header.tsx
import React from 'react';
import styles from './Header.module.scss';
import { useEditor } from '../../contexts/EditorContext';
import { useToast } from '../../contexts/ToastContext'; // Importar o contexto de Toast
import { FaLightbulb, FaQuestionCircle, FaArrowLeft, FaMagic } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { generateAIPrompt } from '../../utils/generateAIPrompt';
import ContentProfileSelector from '../molecules/ContentProfileSelector';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  onHelpButtonClick?: () => void;
  showFocusModeButton?: boolean;
  showAIPromptButton?: boolean; // Prop para controlar se o botão de IA deve ser considerado para esta página
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackButtonClick,
  onHelpButtonClick,
  showFocusModeButton = true,
  showAIPromptButton = false, // Valor padrão false, será true nas páginas de editor
}) => {
  const { 
    isFocusMode, toggleFocusMode,
    text, 
    preferences, // Para ler aiPromptSettings.generateComprehensivePrompt
    advancedMetrics,
    styleAnalysis,
    seoAnalysis
  } = useEditor();
  
  const location = useLocation();
  const { showToast } = useToast(); // Usar o hook do contexto de Toast
  
  const focusButtonText = isFocusMode ? "Desativar Foco" : "Modo Foco";

  // Suas variantes de animação
  const buttonSpringTransition = { type: "spring" as const, stiffness: 400, damping: 17 };
  const iconButtonVariants = {
    rest: { scale: 1, opacity: 0.9 },
    hover: { scale: 1.05, opacity: 1, transition: buttonSpringTransition },
    tap: { scale: 0.95, transition: buttonSpringTransition }
  };
  const titleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.15, ease: "easeIn" } }
  };
  const focusTextVariants = {
    initial: { opacity: 0, y: 5, width: 'auto' },
    animate: { opacity: 1, y: 0, width: 'auto', transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -5, width: 'auto', transition: { duration: 0.15, ease: "easeIn" } }
  };

  // Condição para mostrar o botão de IA
  const canShowAIPromptButton = 
    showAIPromptButton &&
    !isFocusMode && 
    text.trim().length > 0 &&
    (advancedMetrics.textLengthWords > 0 || seoAnalysis !== null || (styleAnalysis && styleAnalysis.passiveVoice.count > -1) ); // Condição de análise um pouco mais abrangente

  const handleGenerateAIPrompt = async () => {
    const currentPathname = location.pathname;
    console.log("Header: handleGenerateAIPrompt INICIADA. Pathname:", currentPathname);

    if (!text.trim() || (advancedMetrics.textLengthWords === 0 && seoAnalysis === null && (!styleAnalysis || styleAnalysis.passiveVoice.count === -1))) {
      showToast("Por favor, digite um texto e aguarde a análise completa para gerar o prompt!", 'error');
      return;
    }

    let activeViewContextForPrompt: 'metrics' | 'style' | 'seo' | 'all' = 'all';
    if (preferences.aiPromptSettings && !preferences.aiPromptSettings.generateComprehensivePrompt) { // Verifica se aiPromptSettings existe
      if (currentPathname.includes('/editor/metrics') || currentPathname === '/') {
        activeViewContextForPrompt = 'metrics';
      } else if (currentPathname.includes('/editor/style')) {
        activeViewContextForPrompt = 'style';
      } else if (currentPathname.includes('/editor/seo')) {
        activeViewContextForPrompt = 'seo';
      }
    }
    
    console.log("Header: ActiveViewContext para o prompt:", activeViewContextForPrompt);

    if (typeof generateAIPrompt !== 'function') {
      console.error("Header: ERRO - generateAIPrompt não é uma função! Verifique a importação em Header.tsx e a exportação em generateAIPrompt.ts.");
      showToast("Erro ao preparar o prompt (função não encontrada).", 'error');
      return;
    }
    
    const { prompt, includedFeedbacks } = generateAIPrompt(
        text, 
        activeViewContextForPrompt, // Passa o contexto da view
        advancedMetrics, 
        styleAnalysis, 
        seoAnalysis
    );
    
    try {
      await navigator.clipboard.writeText(prompt);
      let feedbackSummary = includedFeedbacks.length > 0 
        ? `Feedbacks (${activeViewContextForPrompt}) incluídos: ${includedFeedbacks.join(', ')}.`
        : "Nenhum feedback específico foi adicionado ao prompt contextual.";
      if (activeViewContextForPrompt === 'all' && includedFeedbacks.length === 0) {
        feedbackSummary = "Nenhum feedback crítico ou de melhoria foi identificado em todas as análises.";
      }
      showToast(`Prompt copiado! ${feedbackSummary}`, 'success');
    } catch (err) {
      console.error('Falha ao copiar prompt: ', err);
      showToast('Erro ao copiar o prompt.', 'error');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {showBackButton && (
          <motion.button
            className={`${styles.button} ${styles.iconButton}`}
            onClick={onBackButtonClick}
            variants={iconButtonVariants} initial="rest" whileHover="hover" whileTap="tap"
            aria-label="Voltar"
          >
            <FaArrowLeft /> </motion.button>
        )}
          
        <AnimatePresence mode="wait">
          {title && (
            <motion.h1 key={title} className={styles.title} variants={titleVariants}
                       initial="hidden" animate="visible" exit="exit"> {title} </motion.h1>
          )}
        </AnimatePresence>
        {!title && !showBackButton && <div className={styles.logoPlaceholder}></div>}
      </div>

      <div className={styles.rightSection}>
        {canShowAIPromptButton && (
          <motion.button
            className={`${styles.button} ${styles.aiPromptButton}`}
            onClick={handleGenerateAIPrompt}
            variants={iconButtonVariants}
            initial="rest" whileHover="hover" whileTap="tap"
            title="Gerar Prompt para Refinamento com IA"
          >
            <FaMagic className={styles.buttonIcon} />
            <span className={styles.buttonText}>Gerar Prompt IA</span>
          </motion.button>
        )}

        {/* Ele só será mostrado se não estivermos no modo foco */}
        {!isFocusMode && (
           <ContentProfileSelector compact={true} className={styles.profileSelectorHeader} />
        )}

        {showFocusModeButton && (
          <motion.button
            className={`${styles.button} ${styles.focusButton} ${isFocusMode ? styles.focusActive : ''}`}
            onClick={toggleFocusMode} variants={iconButtonVariants}
            initial="rest" whileHover="hover" whileTap="tap"
          >
            <FaLightbulb className={styles.buttonIcon} />
            <div className={styles.focusButtonTextContainer}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={focusButtonText} variants={focusTextVariants}
                             initial="initial" animate="animate" exit="exit"
                             className={styles.focusButtonTextSpan}
                > {focusButtonText} </motion.span>
              </AnimatePresence>
            </div>
          </motion.button>
        )}

        {onHelpButtonClick && (
            <motion.button
              className={`${styles.button} ${styles.iconButton}`}
              onClick={onHelpButtonClick}
              variants={iconButtonVariants} initial="rest" whileHover="hover" whileTap="tap"
              aria-label="Ajuda"
            >
                <FaQuestionCircle />
            </motion.button>
        )}
      </div>
    </header>
  );
};

export default Header;
