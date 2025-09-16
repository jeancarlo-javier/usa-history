/// <reference types="vite/client" />

declare module "*.json" {
  const value: unknown;
  export default value;
}

export interface Event {
  id: number;
  title: string;
  year: number;
  latitude: number;
  longitude: number;
  description: string;
  image: string;
  modernConnection: string;
  significance: number;
  prominent?: boolean;
  tags?: string[];
  sources?: {
    title: string;
    author?: string;
    year?: number;
    url?: string;
  }[];
}
