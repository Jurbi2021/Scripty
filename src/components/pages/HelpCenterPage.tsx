// src/components/pages/HelpCenterPage.tsx
import React from 'react';
import HelpCenterLayout, { TableOfContentsItem } from '../templates/HelpCenterLayout'; // Importar TableOfContentsItem
import Text from '../atoms/Text';
import Toggle from '../atoms/Toggle';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './HelpCenterPage.module.scss';

const HelpCenterPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const CodeText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className={styles.codeText}>{children}</span>
  );

  // Definir os itens do sumário
  const tocItems: TableOfContentsItem[] = [
    { id: 'metodologia-calculos', title: 'Metodologia dos Cálculos' },
    { id: 'indices-legibilidade', title: 'Índices de Legibilidade' },
    { id: 'analise-estilo', title: 'Análise de Estilo' },
    { id: 'novas-metricas-avancadas', title: 'Métricas de Clareza e Tom' }, 
    { id: 'analise-seo', title: 'Análise de SEO' },
    { id: 'jurbix', title: 'Índice JurbiX (Aprimorado)' },
  ];

  return (
    // Passar os tocItems para o HelpCenterLayout
    <HelpCenterLayout tableOfContents={tocItems}>
      <div className={styles.pageContent}> {/* Esta div interna pode manter o max-width e padding */}
        <div className={styles.headerSection}>
          <Text as="h1" size="large" weight="bold" className={styles.mainTitle}>
            Central de Ajuda Scripty
          </Text>
          <div className={styles.themeToggleContainer}>
            <Text size="small" weight="semibold">
              {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
            </Text>
            <Toggle isOn={theme === 'dark'} onToggle={toggleTheme} ariaLabel="Mudar tema" />
          </div>
        </div>

        <Text as="p" className={styles.introParagraph}>
          Bem-vindo à Central de Ajuda do Scripty! Aqui você encontra detalhes sobre como calculamos cada métrica e como interpretar os resultados para aprimorar seus textos.
        </Text>

        {/* Seção de Metodologia dos Cálculos */}
        <section id="metodologia-calculos" className={styles.section}>
          <Text as="h2" size="large" weight="semibold" className={styles.sectionTitle}>
            Metodologia dos Cálculos
          </Text>
          <Text as="p" className={styles.sectionIntro}>
            Entenda como cada métrica no Scripty é calculada:
          </Text>

          <ul className={styles.metricList}>
            {/* Palavras */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Palavras</Text>
              <Text as="p">Contamos todas as palavras separadas por espaços, excluindo espaços extras.</Text>
            </li>
            {/* Frases */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Frases</Text>
              <Text as="p">Contamos as frases separadas por pontos finais, exclamações ou interrogações (<CodeText>.</CodeText>, <CodeText>!</CodeText>, <CodeText>?</CodeText>).</Text>
            </li>
            {/* Parágrafos */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Parágrafos</Text>
              <Text as="p">Contamos os blocos de texto separados por duas quebras de linha (<CodeText>\n\n</CodeText>).</Text>
            </li>
            {/* Palavras Únicas */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Palavras Únicas</Text>
              <Text as="p">Contamos palavras distintas, ignorando maiúsculas e minúsculas (ex.: "Casa" e "casa" contam como uma só).</Text>
            </li>
            {/* Média de Caracteres por Palavra */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Média de Caracteres por Palavra</Text>
              <Text as="p">Calculamos a média do tamanho das palavras (número total de caracteres nas palavras dividido pelo número de palavras).</Text>
            </li>
            {/* Tempo de Leitura Estimado */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Tempo de Leitura Estimado</Text>
              <Text as="p">Estimamos o tempo de leitura com base em 180 palavras por minuto (WPM) para o Scripty. O tempo é arredondado para cima.</Text>
            </li>
            {/* Palavras por Frase */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Média de Palavras por Frase</Text>
              <Text as="p">Calculamos a média de palavras por frase (total de palavras dividido pelo número de frases).</Text>
            </li>
            {/* Índice de Redundância */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Índice de Redundância</Text>
              <Text as="p">Calculamos a porcentagem de palavras repetidas. Classificamos como:</Text>
              <ul className={styles.subList}>
                <li><Text weight="semibold">Excelente:</Text> &lt;15%</li>
                <li><Text weight="semibold">Bom:</Text> 15-30%</li>
                <li><Text weight="semibold">Regular:</Text> 30-50%</li>
                <li><Text weight="semibold">Ruim:</Text> &gt;50%</li>
              </ul>
            </li>
            {/* Comprimento do Texto */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Comprimento do Texto (Feedback Geral)</Text>
              <Text as="p">Classificamos com base no número de palavras:</Text>
              <ul className={styles.subList}>
                <li><Text weight="semibold">Muito Curto para SEO:</Text> &lt;300 palavras</li>
                <li><Text weight="semibold">Adequado para SEO:</Text> 300-2000 palavras</li>
                <li><Text weight="semibold">Muito Longo para SEO:</Text> &gt;2000 palavras</li>
              </ul>
            </li>
          </ul>
        </section>

        <section id="indices-legibilidade" className={styles.section}>
          <Text as="h2" size="large" weight="semibold" className={styles.sectionTitle}>
            Índices de Legibilidade
          </Text>
          <ul className={styles.metricList}>
            {/* Gunning Fog */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Índice Gunning Fog</Text>
              <Text as="p">Usamos a fórmula: <CodeText>0.4 * (palavras por frase + 100 * (palavras complexas / total de palavras))</CodeText>, onde palavras complexas são aquelas com mais de 6 caracteres. Classificamos como:</Text>
              <ul className={styles.subList}>
                <li><Text weight="semibold">Muito Fácil (&lt;8):</Text> Acessível para leitores com ensino fundamental.</li>
                <li><Text weight="semibold">Fácil (8-10):</Text> Adequado para leitores com ensino médio.</li>
                <li><Text weight="semibold">Médio (10-14):</Text> Requer ensino superior ou conhecimento técnico.</li>
                <li><Text weight="semibold">Difícil (&gt;14):</Text> Texto complexo, possivelmente técnico ou acadêmico.</li>
              </ul>
            </li>
            {/* Flesch-Kincaid Reading Ease */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Índice Flesch-Kincaid Reading Ease</Text>
              <Text as="p">Usamos a fórmula: <CodeText>206.835 - 1.015 * (palavras por frase) - 84.6 * (sílabas por palavra)</CodeText>. Classificamos como:</Text>
              <ul className={styles.subList}>
                <li><Text weight="semibold">Muito Fácil (90-100):</Text> Acessível para leitores de 5ª série.</li>
                <li><Text weight="semibold">Fácil (60-90):</Text> Adequado para leitores de 6ª a 8ª série.</li>
                <li><Text weight="semibold">Médio (30-60):</Text> Adequado para leitores com ensino médio.</li>
                <li><Text weight="semibold">Difícil (0-30):</Text> Nível universitário ou técnico.</li>
              </ul>
            </li>
            {/* SMOG */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Índice SMOG</Text>
              <Text as="p">Usamos a fórmula: <CodeText>1.0430 * sqrt(palavras polissílabas * (30 / frases)) + 3.1291</CodeText>, onde palavras polissílabas são aquelas com 3 ou mais sílabas. Classificamos como:</Text>
              <ul className={styles.subList}>
                <li><Text weight="semibold">Muito Fácil (&lt;9):</Text> Acessível para leitores de 5ª série.</li>
                <li><Text weight="semibold">Fácil (9-12):</Text> Adequado para leitores de 6ª a 9ª série.</li>
                <li><Text weight="semibold">Médio (12-16):</Text> Adequado para leitores com ensino médio.</li>
                <li><Text weight="semibold">Difícil (&gt;16):</Text> Nível universitário ou técnico.</li>
              </ul>
            </li>
            {/* Coleman-Liau */}
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Índice Coleman-Liau</Text>
              <Text as="p">Usamos a fórmula: <CodeText>0.0588 * (letras por 100 palavras) - 0.296 * (frases por 100 palavras) - 15.8</CodeText>. Classificamos como:</Text>
              <ul className={styles.subList}>
                <li><Text weight="semibold">Muito Fácil (&lt;8):</Text> Acessível para leitores de 5ª série.</li>
                <li><Text weight="semibold">Fácil (8-10):</Text> Adequado para leitores de 6ª a 8ª série.</li>
                <li><Text weight="semibold">Médio (10-14):</Text> Adequado para leitores com ensino médio.</li>
                <li><Text weight="semibold">Difícil (&gt;14):</Text> Nível universitário ou técnico.</li>
              </ul>
            </li>
          </ul>
        </section>


        <section id="analise-estilo" className={styles.section}>
          <Text as="h2" size="large" weight="semibold" className={styles.sectionTitle}>
            Análise de Estilo (Aprimorada)
          </Text>
          <ul className={styles.metricList}>
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Voz Passiva</Text>
              <Text as="p">A deteção foi aprimorada para incluir tempos verbais compostos (ex: <CodeText>tem sido feito</CodeText>) e mais particípios irregulares, oferecendo maior precisão.</Text>
            </li>
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Frases Complexas</Text>
              <Text as="p">Agora usamos um <CodeText>complexityScore</CodeText> que considera não apenas o número de palavras, mas também a média de sílabas, o número de vírgulas e de conjunções para uma avaliação mais realista da complexidade da frase.</Text>
            </li>
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Uso de Advérbios</Text>
              <Text as="p">A lista de advérbios comuns e a deteção de palavras terminadas em "-mente" foi refinada para evitar falsos positivos.</Text>
            </li>
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Repetição de Palavras (Nova)</Text>
              <Text as="p">Esta nova análise identifica palavras (ignorando termos comuns) que se repetem excessivamente no texto, tanto de forma global quanto próximas umas das outras, ajudando a melhorar a fluidez e a riqueza do vocabulário.</Text>
            </li>
            <li className={styles.metricItem}>
                <Text as="h3" weight="semibold" className={styles.metricName}>Diversidade Léxica</Text>
                <Text as="p">Mede a variedade de palavras usadas através do Índice de Shannon.</Text>
            </li>
            <li className={styles.metricItem}>
                <Text as="h3" weight="semibold" className={styles.metricName}>Conectores Discursivos</Text>
                <Text as="p">Analisa o uso de palavras de ligação para garantir a coesão do texto.</Text>
            </li>
          </ul>
        </section>

        <section id="novas-metricas-avancadas" className={styles.section}>
            <Text as="h2" size="large" weight="semibold" className={styles.sectionTitle}>
                Métricas de Clareza e Tom
            </Text>
            <ul className={styles.metricList}>
                <li className={styles.metricItem}>
                    <Text as="h3" weight="semibold" className={styles.metricName}>Índice de Clareza</Text>
                    <Text as="p">Uma nova pontuação (0-100) baseada na densidade de informação, comprimento médio das frases e uso de palavras complexas para avaliar quão claro e direto é o seu texto.</Text>
                </li>
                <li className={styles.metricItem}>
                    <Text as="h3" weight="semibold" className={styles.metricName}>Análise de Concisão</Text>
                    <Text as="p">Identifica expressões e frases prolixas (ex: <CodeText>devido ao fato de que</CodeText>) e sugere alternativas mais diretas (ex: <CodeText>porque</CodeText>) para tornar a sua escrita mais objetiva.</Text>
                </li>
                <li className={styles.metricItem}>
                    <Text as="h3" weight="semibold" className={styles.metricName}>Análise de Tom e Formalidade</Text>
                    <Text as="p">O Scripty agora analisa e classifica o seu texto em diferentes níveis de formalidade (ex: de "muito informal" a "muito formal") e identifica o tom predominante (ex: neutro, técnico, persuasivo), ajudando a adequar a sua escrita ao público e ao contexto desejado.</Text>
                </li>
            </ul>
        </section>

        <section id="analise-seo" className={styles.section}>
          <Text as="h2" size="large" weight="semibold" className={styles.sectionTitle}>
            Análise de SEO
          </Text>
          <Text as="p" className={styles.sectionIntro}>
            Analisa o texto para otimização em motores de busca (SEO). Inclui:
          </Text>
          <Text as="h2" size="large" weight="semibold" className={styles.sectionTitle}>
            Análise de SEO
          </Text>
          <Text as="p" className={styles.sectionIntro}>
            Analisa o texto para otimização em motores de busca (SEO). Inclui:
          </Text>
          <ul className={styles.metricList}>
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Palavra-Chave Principal</Text>
              <Text as="p">Identificamos a palavra mais frequente no texto (excluindo stop words e palavras com menos de 3 caracteres).</Text>
            </li>
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Densidade de Palavra-Chave (Principal e LSI)</Text>
              <Text as="p">Calculamos a densidade da palavra-chave principal e sinônimos (LSI). Classificamos como:</Text>
              <ul className={styles.subList}>
                <li><Text weight="semibold">Baixa (&lt;1%):</Text> Sugerimos aumentar a densidade.</li>
                <li><Text weight="semibold">Ideal (1-2%):</Text> Ótimo para SEO.</li>
                <li><Text weight="semibold">Alta (&gt;2%):</Text> Sugerimos reduzir.</li>
              </ul>
            </li>
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Estrutura Textual (Headings)</Text>
              <Text as="p">Verificamos se o texto possui uma estrutura com títulos e parágrafos bem definidos.</Text>
            </li>
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Legibilidade para SEO</Text>
              <Text as="p">Usamos o índice Flesch-Kincaid (ideal entre 60-90).</Text>
            </li>
            <li className={styles.metricItem}>
              <Text as="h3" weight="semibold" className={styles.metricName}>Comprimento do Texto para SEO</Text>
              <Text as="p">Avaliamos o número de palavras: &lt;300 (curto), 300-2000 (adequado), &gt;2000 (longo).</Text>
            </li>
          </ul>
        </section>
        <section id="jurbix" className={styles.section}>
          <Text as="h2" size="large" weight="semibold" className={styles.sectionTitle}>
            Índice de Escrita JurbiX (Aprimorado)
          </Text>
          <Text as="p" className={styles.sectionIntro}>
            O JurbiX é uma métrica proprietária do Scripty que avalia a qualidade geral da escrita. A nova versão agora integra os dados da Análise de Estilo (como uso de voz passiva e advérbios) e as novas métricas de Clareza e Concisão para gerar uma pontuação ainda mais precisa e contextual de 0 a 100.
          </Text>
          <ul className={styles.subList}>
            <li><Text weight="semibold">80-100 (Muito Fácil):</Text> Texto acessível a todos.</li>
            <li><Text weight="semibold">60-79 (Fácil):</Text> Bom para a maioria dos leitores.</li>
            <li><Text weight="semibold">40-59 (Médio):</Text> Pode ser mais claro.</li>
            <li><Text weight="semibold">0-39 (Difícil):</Text> Simplifique o texto.</li>
          </ul>
          <Text as="p" className={styles.tipParagraph}>
            Dica: Use frases curtas, voz ativa e evite advérbios excessivos para melhorar a pontuação JurbiX.
          </Text>
        </section>
      </div>
    </HelpCenterLayout>
  );
};

export default HelpCenterPage;