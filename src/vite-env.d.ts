/// <reference types="vite-plugin-svgr/client" />

// Adicione as declarações abaixo para o Swiper
declare module 'swiper/css';
declare module 'swiper/css/free-mode';
declare module 'swiper/css/pagination';
declare module 'swiper/css/navigation';
declare module 'swiper/css/scrollbar';

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss';

// Declaração genérica para arquivos .css globais (como App.css e index.css)
declare module '*.css';