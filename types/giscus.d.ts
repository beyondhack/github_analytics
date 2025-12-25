/**
 * Type definitions for Giscus integration
 */

export interface GiscusConfig {
    repo: string;
    repoId?: string;
    category: string;
    categoryId?: string;
    mapping?: 'pathname' | 'url' | 'title' | 'og:title' | 'specific' | 'number';
    strict?: '0' | '1';
    reactionsEnabled?: '0' | '1';
    emitMetadata?: '0' | '1';
    inputPosition?: 'top' | 'bottom';
    theme?: 'light' | 'dark' | 'preferred_color_scheme' | 'transparent_dark' | 'noborder_light' | 'noborder_dark';
    lang?: string;
    loading?: 'lazy' | 'eager';
}

export type GiscusTheme = 'light' | 'dark';
