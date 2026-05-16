import type { TVANAdapter } from '@haravan/shared';
import { MockAdapter } from './mock-adapter';

export function createAdapter(provider: string = 'mock'): TVANAdapter {
  switch (provider) {
    case 'mock':
      return new MockAdapter();
    case 'hilo':
      throw new Error('HiloAdapter not implemented yet — use MockAdapter');
    default:
      throw new Error(`Unknown TVAN provider: ${provider}`);
  }
}
