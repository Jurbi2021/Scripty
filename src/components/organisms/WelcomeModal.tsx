// src/components/organisms/WelcomeModal.tsx
import React, { useState, useEffect } from 'react'; // <<< Adicionado useState e useEffect
import styles from './WelcomeModal.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../atoms/Button';
import Text from '../atoms/Text';
import { FaTimes, FaMagic } from 'react-icons/fa';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Opcional: podemos tornar o tempo de espera uma prop para ser configurável
  closeDelaySeconds?: number;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, closeDelaySeconds = 4 }) => {
  // --- NOVA LÓGICA ---
  // Estado para controlar se o botão de fechar está desabilitado
  const [isCloseDisabled, setIsCloseDisabled] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Se o modal for aberto, inicia o temporizador
    if (isOpen) {
      // Garante que o botão comece sempre desabilitado ao abrir
      setIsCloseDisabled(true); 
      
      timer = setTimeout(() => {
        // Após o tempo definido, habilita o botão
        setIsCloseDisabled(false);
      }, closeDelaySeconds * 1000); // Converte segundos para milissegundos
    }

    // Função de limpeza: se o componente for desmontado, o timer é cancelado.
    return () => {
      clearTimeout(timer);
    };
  }, [isOpen, closeDelaySeconds]); // O efeito roda sempre que o modal é aberto
  // --- FIM DA NOVA LÓGICA ---

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
    hidden: { opacity: 0, y: -40, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className={styles.modal}
            variants={modalVariants}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-modal-title"
          >
            <button 
              onClick={onClose} 
              // <<< MUDANÇA AQUI: Adiciona a classe 'disabled' e a propriedade 'disabled' >>>
              className={`${styles.closeButton} ${isCloseDisabled ? styles.disabled : ''}`}
              aria-label="Fechar modal"
              disabled={isCloseDisabled}
            >
              <FaTimes />
            </button>

            <div className={styles.modalContent}>
                <Text as="h2" size="large" weight="bold" className={styles.title}>
                Bem-vindo ao Scripty!
              </Text>
              
              <Text as="p" className={styles.paragraph}>
                O Scripty é o seu novo parceiro para análise e refinamento de textos. O nosso objetivo é ir além de uma simples contagem de palavras, oferecendo métricas detalhadas de <b>legibilidade, estilo e SEO</b> para ajudar a aprimorar a sua escrita.
              </Text>

              <Text as="p" className={styles.paragraph}>
                Use os separadores na barra lateral para navegar entre as diferentes análises. Para uma experiência sem distrações, experimente o <b>Modo Foco</b> no canto superior direito.
              </Text>

                <div className={styles.howToUseSection}>
                <Text as="h3" weight="semibold" className={styles.subheading}>Como usar o Scripty:</Text>
                    <Text size="small">
                      <strong>1. Escreva e Analise:</strong> Digite ou cole o seu texto. Use os separadores na barra lateral (Análise de Estilo, SEO, etc.) para ver os pontos de melhoria que o Scripty identificou.
                    </Text>
                    <Text size="small">
                      <strong>2. Gere um Prompt Inteligente:</strong> Quando quiser refinar o seu texto, clique no botão com o ícone de varinha mágica ( <FaMagic style={{ display: 'inline', verticalAlign: 'middle' }}/> ) no canto superior direito. Isso irá copiar um prompt otimizado para a sua área de transferência, contendo o seu texto e as sugestões de melhoria do Scripty.
                    </Text>
            
                    <Text size="small">
                      <strong>3. Cole na sua IA:</strong> Leve este prompt para a sua ferramenta de IA generativa preferida (ChatGPT, Gemini, etc.) para receber uma versão do seu texto com as melhorias já aplicadas!
                    </Text>
              </div>
              
              <Text as="p" className={styles.paragraph}>
              Para uma análise ainda mais precisa, você pode selecionar um <strong>Perfil de Conteúdo</strong> (como "Blog" ou "Relatório Formal") no seletor que se encontra no cabeçalho. Cada perfil ajusta automaticamente os critérios de análise do Scripty para se adequar melhor ao seu tipo de texto.
              </Text>

              <Text as="p" className={styles.paragraph}>
               Esta é uma versão <strong>Beta</strong> e o seu feedback é muito valioso! Se encontrar algum problema ou tiver alguma sugestão, por favor, envie um email para: <a href="mailto:bergallo.jurgen@gmail.com" className={styles.emailLink}>bergallo.jurgen@gmail.com</a>
              </Text>

              <Button 
                onClick={onClose} 
                variant="primary" 
                className={styles.confirmButton}
                // <<< MUDANÇA AQUI: Também desabilita o botão principal >>>
                disabled={isCloseDisabled}
              >
                {/* Opcional: Mudar o texto do botão enquanto estiver desabilitado */}
                {isCloseDisabled ? `Aguarde ${closeDelaySeconds}s...` : 'Começar a Escrever!'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;