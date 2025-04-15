import type { ProxyOptions } from 'vite';

function convertProxy(proxyStr: string): Record<string, ProxyOptions> {
  const proxyMap: Record<string, ProxyOptions> = {};

  if (!proxyStr) return proxyMap;

  try {
    const proxyArray = JSON.parse(proxyStr.trim());

    for (const item of proxyArray) {
      const [prefix, target, rewritePrefix] = item;

      if (!prefix || !target) {
        console.error('prefix or target is not a valid JSON string', proxyStr);
        throw new Error('prefix or target is not a valid JSON string');
      }

      Reflect.set(proxyMap, prefix, {
        changeOrigin: true,
        rewrite: rewritePrefix
          ? (path: string) => path.replace(new RegExp(`^${prefix}`), '')
          : undefined,
        target,
        ws: true,
      });
    }

    return proxyMap;
  } catch {
    console.error('proxyStr is not a valid JSON string', proxyStr);
    return proxyMap;
  }
}

export { convertProxy };
