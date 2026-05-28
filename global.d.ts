// global.d.ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Explicitly define the alias mapping
declare module "@/app/globals.css" {
  const content: { [className: string]: string };
  export default content;
}

export {};
