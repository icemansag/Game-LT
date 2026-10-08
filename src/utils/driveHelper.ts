// src/utils/driveHelper.ts
import { MIB_ASSETS, MIBAssetKey } from '../config/assets';

const STORAGE_KEY = 'mib_custom_drive_assets';

export function extractDriveId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Formato: /file/d/FILE_ID/
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Formato: id=FILE_ID
  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  // Formato: /d/FILE_ID
  const matchD = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchD && matchD[1]) return matchD[1];

  // Si ya es un ID directo sin URL
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

export function getDriveDirectUrl(fileIdOrUrl: string): string {
  const id = extractDriveId(fileIdOrUrl);
  if (!id) return '';
  return `https://drive.google.com/uc?export=view&id=${id}`;
}

export function getDriveCdnUrl(fileIdOrUrl: string): string {
  const id = extractDriveId(fileIdOrUrl);
  if (!id) return '';
  return `https://lh3.googleusercontent.com/d/${id}`;
}

export function getCustomDriveAssets(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore storage parse error
  }
  return {};
}

export function saveCustomDriveAsset(key: string, urlOrId: string) {
  try {
    const current = getCustomDriveAssets();
    current[key] = urlOrId.trim();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Ignore storage write error
  }
}

export function resolveAssetUrl(key: string): { primary: string; secondary: string } {
  const custom = getCustomDriveAssets();
  const source = custom[key] || (MIB_ASSETS as Record<string, string>)[key] || '';
  const id = extractDriveId(source);

  if (!id) {
    return { primary: source, secondary: source };
  }

  return {
    primary: `https://lh3.googleusercontent.com/d/${id}`,
    secondary: `https://drive.google.com/uc?export=view&id=${id}`,
  };
}
