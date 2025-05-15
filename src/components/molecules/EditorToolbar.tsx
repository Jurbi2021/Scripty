// EditorToolbar.tsx
import React, { useRef, useEffect } from 'react';
import Text from '../atoms/Text';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from './EditorToolbar.module.scss';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow } from 'swiper/modules';
import { EffectCreative } from 'swiper/modules';

// Importar CSS
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import 'swiper/css/effect-coverflow';
// @ts-ignore
import "swiper/css/pagination";

interface MetricItem {
  label: string;
  value: string | number;
}

interface EditorToolbarProps {
  metrics: MetricItem[];
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ metrics }) => {
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && navigationPrevRef.current && navigationNextRef.current) {
      // @ts-ignore
      const swiper = swiperRef.current.swiper;
      if (swiper) {
        swiper.params.navigation.prevEl = navigationPrevRef.current;
        swiper.params.navigation.nextEl = navigationNextRef.current;
        swiper.navigation.init();
        swiper.navigation.update();
      }
    }
  }, []);

  return (
    <div className={styles.toolbar}>
      <button 
        ref={navigationPrevRef} 
        className={styles.arrowButton}
        aria-label="Anterior"
      >
        <FaChevronLeft />
      </button>
      
      <Swiper
  ref={swiperRef}
  modules={[Navigation]}
  centeredSlides={true}
  slidesPerView={5}
  spaceBetween={24}
  loop={true}
  grabCursor={true}
  className={styles.carousel}
>
        {metrics.map((metric, index) => (
          <SwiperSlide 
            key={index} 
            className={styles.swiperSlide}
          >
            <div className={styles.metricItem}>
              <Text size="large" weight="bold" className={styles.value}>
                {metric.value}
              </Text>
              <Text size="small" className={styles.label}>
                {metric.label}
              </Text>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      <button 
        ref={navigationNextRef} 
        className={styles.arrowButton}
        aria-label="Próximo"
      >
        <FaChevronRight />
      </button>
      
      <span className={styles.helpText}>Deslize para ver mais métricas</span>
    </div>
  );
};

export default EditorToolbar;
