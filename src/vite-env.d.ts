/// <reference types="vite/client" />
declare module '*.glb';
declare module '*.png';
declare module '*.jpg';
declare module '*.txt?raw' {
  const content: string;
  export default content;
}
