// src/components/organisms/Header.tsx
import React, { useState } from 'react';
import styles from './Header.module.scss';
import { useEditor } from '../../contexts/EditorContext';
import { FaLightbulb, FaQuestionCircle, FaArrowLeft, FaMagic } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom'; // <<< IMPORTAÇÃO CORRETA
import { generateAIPrompt } from '../../utils/generateAIPrompt'; // Assegure-se que este arquivo existe/será criado

interface ToastProps {
  message: string;
  onDismiss: () => void;
  type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss, type = 'success' }) => {

  return (
    <motion.div 
      className={`${styles.toast} ${type === 'error' ? styles.toastError : styles.toastSuccess}`}
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      style={{ position: 'fixed', bottom: '30px', left: '50%', zIndex: 2000 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {message}
      <button onClick={onDismiss} className={styles.toastClose}>×</button>
    </motion.div>
  );
};
// --- Fim da Definição do Componente Toast ---


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
  
  const location = useLocation(); // <<< CHAMADA CORRETA DO HOOK, NO TOPO DO COMPONENTE
  
  const focusButtonText = isFocusMode ? "Desativar Foco" : "Modo Foco";

  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState<boolean>(false);

  // Suas variantes de animação
  const buttonSpringTransition = { type: "spring" as const, stiffness: 400, damping: 17 };
  const iconButtonVariants = {
    rest: { scale: 1, opacity: 0.9 },
    hover: { scale: 1.05, opacity: 1, transition: buttonSpringTransition },
    tap: { scale: 0.95, transition: buttonSpringTransition }
  };
  const titleVariants = { /* ... (sua definição, se diferente da última enviada) ... */ 
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.15, ease: "easeIn" } }
  };
  const focusTextVariants = { /* ... (sua definição, se diferente da última enviada) ... */ 
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

  const displayToast = (message: string, type: 'success' | 'error' = 'success', duration: number = 4000) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => { setShowToast(false); }, duration);
    // A limpeza do timer pode ser gerenciada aqui, ou no useEffect do Toast se ele tiver um auto-dismiss interno.
    // Para este exemplo, o displayToast controla o fechamento.
  };

  const handleGenerateAIPrompt = async () => {
    const currentPathname = location.pathname; // Usa o pathname obtido do hook no topo
    console.log("Header: handleGenerateAIPrompt INICIADA. Pathname:", currentPathname);

    if (!text.trim() || (advancedMetrics.textLengthWords === 0 && seoAnalysis === null && (!styleAnalysis || styleAnalysis.passiveVoice.count === -1))) {
      displayToast("Por favor, digite um texto e aguarde a análise completa para gerar o prompt!", 'error');
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
      } else {
         // Se não for uma página de editor conhecida e o modo abrangente estiver desligado,
         // talvez seja melhor não gerar feedbacks específicos ou ter um comportamento padrão.
         // Por ora, manter 'all' pode ser um fallback se a lógica de showAIPromptButton falhar em filtrar.
         // No entanto, showAIPromptButton já deve prevenir isso.
      }
    }
    
    console.log("Header: ActiveViewContext para o prompt:", activeViewContextForPrompt);

    if (typeof generateAIPrompt !== 'function') {
      console.error("Header: ERRO - generateAIPrompt não é uma função! Verifique a importação em Header.tsx e a exportação em generateAIPrompt.ts.");
      displayToast("Erro ao preparar o prompt (função não encontrada).", 'error');
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
      displayToast(`Prompt copiado! ${feedbackSummary}`, 'success', 6000); // Aumentei um pouco a duração
    } catch (err) {
      console.error('Falha ao copiar prompt: ', err);
      displayToast('Erro ao copiar o prompt.', 'error');
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
            {/* Se quiser texto: <span className={styles.buttonText}>Gerar Prompt IA</span> */}
          </motion.button>
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
      
      <AnimatePresence>
        {showToast && <Toast message={toastMessage} onDismiss={() => setShowToast(false)} type={toastType} />}
      </AnimatePresence>
    </header>
  );
};

export default Header;