import { createHash } from 'crypto';

export function buildCacheKey(prefix: string, params: Record<string, any>): string {
  const sorted = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        acc[key] = params[key];
      }
      return acc;
    }, {} as Record<string, any>);

  const hash = createHash('md5')
    .update(JSON.stringify(sorted))
    .digest('hex')
    .substring(0, 12);

  return `${prefix}:${hash}`;
}
