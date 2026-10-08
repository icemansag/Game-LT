// Asset Manager for Examen MIB
// Handles preloading, offline caching, fallbacks, and custom overrides.

import { Suspect } from '../types';

const STORAGE_KEY_OVERRIDES = 'mib_custom_assets_v1';

class MIBAssetManager {
  private customOverrides: Record<string, string> = {};
  private preloadCache = new Set<string>();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_OVERRIDES);
        if (saved) {
          this.customOverrides = JSON.parse(saved);
        }
      } catch (e) {
        console.warn('Failed to load asset overrides from localStorage', e);
      }
    }
  }

  // Resolves the image source: checks custom override first, then standard path
  public resolveImageSrc(rawPath: string): string {
    const cleanPath = rawPath.replace(/^\//, '');
    if (this.customOverrides[cleanPath]) {
      return this.customOverrides[cleanPath];
    }
    // Prefix with / if not present so it works in Vite
    return `/${cleanPath}`;
  }

  // Preloads a list of images
  public preloadImages(paths: string[]): Promise<void[]> {
    const promises = paths.map(path => {
      const src = this.resolveImageSrc(path);
      if (this.preloadCache.has(src)) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          this.preloadCache.add(src);
          resolve();
        };
        img.onerror = () => {
          // Resolve even on error so preloader does not stall
          resolve();
        };
      });
    });
    return Promise.all(promises);
  }

  // Set custom user image override (e.g. dataURL)
  public setCustomOverride(rawPath: string, dataUrl: string) {
    const cleanPath = rawPath.replace(/^\//, '');
    this.customOverrides[cleanPath] = dataUrl;
    this.preloadCache.delete(`/${cleanPath}`);
    this.preloadCache.delete(dataUrl);
    try {
      localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(this.customOverrides));
    } catch (e) {
      console.warn('Failed to save asset override to localStorage', e);
    }
  }

  // Reset custom asset override
  public removeCustomOverride(rawPath: string) {
    const cleanPath = rawPath.replace(/^\//, '');
    delete this.customOverrides[cleanPath];
    try {
      localStorage.setItem(STORAGE_KEY_OVERRIDES, JSON.stringify(this.customOverrides));
    } catch (e) {
      console.warn('Failed to save asset override to localStorage', e);
    }
  }

  public clearAllOverrides() {
    this.customOverrides = {};
    try {
      localStorage.removeItem(STORAGE_KEY_OVERRIDES);
    } catch (e) {
      console.warn('Failed to clear asset overrides', e);
    }
  }

  public hasCustomOverride(rawPath: string): boolean {
    const cleanPath = rawPath.replace(/^\//, '');
    return !!this.customOverrides[cleanPath];
  }

  public getAllOverrides(): Record<string, string> {
    return { ...this.customOverrides };
  }

  // Generates dynamic holographic fallback data-URI if physical image fails to load
  public generateFallbackSVG(suspect: Suspect): string {
    const isAlien = suspect.esCulpable;
    const color = isAlien ? '#ff0055' : '#00e5ff';
    const subColor = isAlien ? '#ffcc00' : '#00ff66';
    const threatText = isAlien ? 'AMENAZA CONFIRMADA' : 'CIVIL INOCENTE';

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 280" width="240" height="280">
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0d1117"/>
            <stop offset="100%" stop-color="#07090e"/>
          </linearGradient>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          </pattern>
        </defs>

        <rect width="240" height="280" fill="url(#bgGrad)"/>
        <rect width="240" height="280" fill="url(#grid)"/>

        <!-- Scanlines -->
        <line x1="10" y1="35" x2="230" y2="35" stroke="${color}" stroke-width="1" stroke-dasharray="4 2" opacity="0.6"/>
        <line x1="10" y1="230" x2="230" y2="230" stroke="${color}" stroke-width="1" stroke-dasharray="4 2" opacity="0.6"/>

        <!-- Cyber Border Corners -->
        <path d="M 8 25 L 8 8 L 25 8" fill="none" stroke="${color}" stroke-width="3"/>
        <path d="M 232 25 L 232 8 L 215 8" fill="none" stroke="${color}" stroke-width="3"/>
        <path d="M 8 255 L 8 272 L 25 272" fill="none" stroke="${color}" stroke-width="3"/>
        <path d="M 232 255 L 232 272 L 215 272" fill="none" stroke="${color}" stroke-width="3"/>

        <!-- Target Silhouette -->
        <g transform="translate(120, 115)" opacity="0.9">
          <!-- Head / Torso -->
          ${
            isAlien
              ? `<!-- Alien Head -->
                 <path d="M -35 -40 C -45 -10, -25 35, 0 35 C 25 35, 45 -10, 35 -40 C 25 -70, -25 -70, -35 -40 Z" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2"/>
                 <ellipse cx="-15" cy="-25" rx="8" ry="14" fill="#000" stroke="${subColor}" stroke-width="2" transform="rotate(-15, -15, -25)"/>
                 <ellipse cx="15" cy="-25" rx="8" ry="14" fill="#000" stroke="${subColor}" stroke-width="2" transform="rotate(15, 15, -25)"/>
                 <circle cx="-14" cy="-25" r="3" fill="${subColor}"/>
                 <circle cx="14" cy="-25" r="3" fill="${subColor}"/>
                 <!-- Antennas / Features -->
                 <line x1="-20" y1="-55" x2="-35" y2="-75" stroke="${color}" stroke-width="2"/>
                 <circle cx="-35" cy="-75" r="4" fill="${subColor}"/>
                 <line x1="20" y1="-55" x2="35" y2="-75" stroke="${color}" stroke-width="2"/>
                 <circle cx="35" cy="-75" r="4" fill="${subColor}"/>
                `
              : `<!-- Humanoid Silhouette -->
                 <circle cx="0" cy="-35" r="28" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
                 <path d="M -45 45 C -45 5, -25 5, 0 5 C 25 5, 45 5, 45 45 Z" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
                 <!-- Visor / Specs -->
                 <rect x="-18" y="-40" width="36" height="8" rx="3" fill="${subColor}" opacity="0.8"/>
                `
          }
          <!-- Reticle around silhouette -->
          <circle cx="0" cy="0" r="65" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="6 6" opacity="0.4"/>
          <line x1="0" y1="-75" x2="0" y2="75" stroke="${color}" stroke-width="1" opacity="0.3"/>
          <line x1="-75" y1="0" x2="75" y2="0" stroke="${color}" stroke-width="1" opacity="0.3"/>
        </g>

        <!-- Badge & Status Banner -->
        <rect x="20" y="15" width="200" height="18" rx="3" fill="rgba(0,0,0,0.7)" stroke="${color}" stroke-width="1"/>
        <text x="120" y="27" font-family="monospace" font-size="10" font-weight="bold" fill="${color}" text-anchor="middle" letter-spacing="1">
          [MIB SIM] ${threatText}
        </text>

        <!-- Bottom Warning Label -->
        <rect x="20" y="235" width="200" height="30" rx="3" fill="rgba(0,0,0,0.85)" stroke="rgba(255,255,255,0.1)"/>
        <text x="120" y="248" font-family="'Arial Black', Impact, sans-serif" font-size="11" fill="#ffffff" text-anchor="middle">
          ${suspect.nombre.toUpperCase()}
        </text>
        <text x="120" y="260" font-family="monospace" font-size="9" fill="${subColor}" text-anchor="middle">
          ROL: ${suspect.rol.toUpperCase()}
        </text>
      </svg>
    `;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}

export const assetManager = new MIBAssetManager();
