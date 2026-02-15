declare module 'text-readability' {
  export function flesch(text: string): number;
  export function fleschKincaid(text: string): number;
  export function gunningFog(text: string): number;
  export function colemanLiau(text: string): number;
  export function automatedReadabilityIndex(text: string): number;
  export function SMOG(text: string): number;
}
