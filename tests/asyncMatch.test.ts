import { expect, it } from 'vitest';
import { asyncMatch } from '../src';

it('should execute promises', async () => {
  const matcher = asyncMatch([
    [1, 2, '100'],
    [3, 4, '200'],
    [
      5,
      () => {
        return Promise.resolve('500');
      },
    ],
  ]);

  await expect(matcher(1)).resolves.toEqual('100');
  await expect(matcher(5)).resolves.toEqual('500');
});
