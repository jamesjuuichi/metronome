// declaration.d.ts
declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.mp3' {
  const path: string;
  export default path;
}
