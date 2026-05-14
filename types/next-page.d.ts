import { Metadata } from "next";

// Module augmentation to fix the type constraint for page params
declare module "next" {
  interface PageProps {
    params?: Record<string, any>;
    searchParams?: Record<string, any>;
  }
} 

declare module '*.css';