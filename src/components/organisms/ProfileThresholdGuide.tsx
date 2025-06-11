// src/components/organisms/ProfileThresholdGuide.tsx
import React from 'react';
import styles from './ProfileThresholdGuide.module.scss';
import { useContentProfile } from '../../contexts/ContentProfileContext';
import { FaFileAlt, FaBlog, FaFileContract, FaHashtag, FaBullhorn, FaWrench } from 'react-icons/fa';
import { contentProfiles } from '../../utils/contentProfiles';


// Mapeamento de nomes de ícones para componentes de íconesGvb
const iconMap: { [key: string]: React.ReactNode } = {
  FaFileAlt: <FaFileAlt />,
  FaBlog: <FaBlog />,
  FaFileContract: <FaFileContract />,
  FaHashtag: <FaHashtag />,
  FaBullhorn: <FaBullhorn />,
  FaWrench: <FaWrench />
};

interface ProfileThresholdGuideProps {
  className?: string;
}

const ProfileThresholdGuide: React.FC<ProfileThresholdGuideProps> = ({ className = '' }) => {
  const { currentProfile } = useContentProfile();
  const defaultThresholds = contentProfiles.find(p => p.id === 'default')?.thresholds;
  if (!defaultThresholds) {
    return <div>Erro: Perfil de conteúdo padrão não encontrado.</div>;
  }


  // Função para renderizar um item de limiar com comparação
  const renderThresholdItem = (
    label: string, 
    value: number,  // <<< MUDANÇA: Receber como número
    defaultValue: number, // <<< MUDANÇA: Receber como número
    unit: string = '',
    higherIsBetter: boolean = false
  ) => {
    const isDifferent = value !== defaultValue;
    const isBetter = isDifferent && ((higherIsBetter && value > defaultValue) || (!higherIsBetter && value < defaultValue));
    const formattedValue = `${value}${unit}`;
    
    return (
      <div className={styles.thresholdItem}>
        <span className={styles.thresholdLabel}>{label}</span>
        <span className={`${styles.thresholdValue} ${isDifferent ? (isBetter ? styles.better : styles.stricter) : ''}`}>
          {formattedValue}
          {isDifferent && (
            <span className={styles.comparisonIndicator}>
              ({value > defaultValue ? '+' : ''}{((value - defaultValue)).toFixed(1).replace('.0', '')}{unit})
            </span>
          )}
        </span>
      </div>
    );
  };

  return (
    <div className={`${styles.profileGuide} ${className}`}>
      <div className={styles.profileHeader}>
        <div className={styles.profileIcon}>
          {currentProfile.icon && iconMap[currentProfile.icon] ? iconMap[currentProfile.icon] : <FaFileAlt />}
        </div>
        <div className={styles.profileInfo}>
          <h3>{currentProfile.name}</h3>
          <p>{currentProfile.description}</p>
        </div>
      </div>

      <div className={styles.thresholdGroups}>
        <div className={styles.thresholdGroup}>
          <h4>Estilo de Escrita</h4>
          {renderThresholdItem('Voz Passiva (Máx)', currentProfile.thresholds.passiveVoicePercent, defaultThresholds.passiveVoicePercent, '%', false)}
          {renderThresholdItem('Advérbios (Máx)', currentProfile.thresholds.adverbPercent, defaultThresholds.adverbPercent, '%', false)}
          {renderThresholdItem('Frases Complexas (Máx)', currentProfile.thresholds.complexSentencePercent, defaultThresholds.complexSentencePercent, '%', false)}
          {renderThresholdItem('Repetição de Palavras (Máx)', currentProfile.thresholds.repetitionGlobalPercent, defaultThresholds.repetitionGlobalPercent, '%', false)}
        </div>

        <div className={styles.thresholdGroup}>
          <h4>Legibilidade</h4>
          {renderThresholdItem('JurbiX (Mín)', currentProfile.thresholds.readabilityJurbiXMin, defaultThresholds.readabilityJurbiXMin, '', true)}
          {renderThresholdItem('Flesch-Kincaid (Mín)', currentProfile.thresholds.fleschKincaidMin, defaultThresholds.fleschKincaidMin, '', true)}
          {renderThresholdItem('Gunning Fog (Máx)', currentProfile.thresholds.gunningFogMax, defaultThresholds.gunningFogMax, '', false)}
          {renderThresholdItem('SMOG (Máx)', currentProfile.thresholds.smogMax, defaultThresholds.smogMax, '', false)}
          {renderThresholdItem('Coleman-Liau (Máx)', currentProfile.thresholds.colemanLiauMax, defaultThresholds.colemanLiauMax, '', false)}
        </div>

        <div className={styles.thresholdGroup}>
          <h4>Clareza e Concisão</h4>
          {renderThresholdItem('Clareza Mínima', currentProfile.thresholds.clarityScoreMin, defaultThresholds.clarityScoreMin, '', true)}
          {renderThresholdItem('Expressões Verbosas Máx.', currentProfile.thresholds.verbosePhrasesMax, defaultThresholds.verbosePhrasesMax, '', false)}
        </div>

        <div className={styles.thresholdGroup}>
          <h4>Formalidade</h4>
          {renderThresholdItem('Formalidade Mínima', currentProfile.thresholds.formalityMin, defaultThresholds.formalityMin, '', false)}
          {renderThresholdItem('Formalidade Máxima', currentProfile.thresholds.formalityMax, defaultThresholds.formalityMax, '', false)}
        </div>

        <div className={styles.thresholdGroup}>
          <h4>Comprimento do Texto</h4>
          {renderThresholdItem('Mínimo', currentProfile.thresholds.minWords, defaultThresholds.minWords, ' palavras', false)}
          {renderThresholdItem('Ideal Mínimo', currentProfile.thresholds.optimalMinWords, defaultThresholds.optimalMinWords, ' palavras', false)}
          {renderThresholdItem('Ideal Máximo', currentProfile.thresholds.optimalMaxWords, defaultThresholds.optimalMaxWords, ' palavras', false)}
          {renderThresholdItem('Máximo', currentProfile.thresholds.maxWords, defaultThresholds.maxWords, ' palavras', false)}
        </div>
      </div>
      <div className={styles.profileFooter}>
        <p className={styles.profileNote}>
          <strong>Nota:</strong> Os valores em <span className={styles.better}>verde</span> indicam limiares mais flexíveis, 
          enquanto os valores em <span className={styles.stricter}>laranja</span> indicam limiares mais rigorosos em comparação 
          com o perfil padrão.
        </p>
      </div>
    </div>
  );
};

export default ProfileThresholdGuide;
