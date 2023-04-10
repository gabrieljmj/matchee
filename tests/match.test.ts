import { it, expect } from 'vitest';
import { InvalidExpressionType } from '../src/exceptions/invalid-expression-type';
import { UnhandledMatchExpression } from '../src/exceptions/unhandled-match-expression';
import { objectPaths, match } from '../src';

it('should match the first value that contains a valid expression', async () => {
  const value = match([
    [1, 2, '100'],
    [1, 3, '200'],
  ])(1);

  expect(value).toEqual('100');
});

it('should accept more than one condition', async () => {
  const value = match([
    [1, 2, 3, '100'],
    [4, 5, '200'],
  ])(3);

  expect(value).toEqual('100');
});

it('should match the default value when there is not valid match', async () => {
  const value = match([[1, 2, '100'], [1, 3, '200'], '300'])(4);

  expect(value).toEqual('300');
});

it('should throw an error when there is no default value and not matching keys', async () => {
  expect(() =>
    match([
      [1, '1'],
      [2, '2'],
    ])(3),
  ).toThrow(new UnhandledMatchExpression(3));
});

it('should accept objects as expressions', async () => {
  const value = match([
    [{ a: 1 }, { a: 2 }, '100'],
    [{ a: 3 }, { a: 4 }, '200'],
    '300',
  ])({ a: 1 });

  expect(value).toEqual('100');
});

it('should accept boolean values as expressions', async () => {
  const value = match([[true, '100'], [false, '200'], '300'])(true);

  expect(value).toEqual('100');
});

it('should accept symbols as expressions', async () => {
  const aSymbol = Symbol('a');
  const value = match([[aSymbol, '100'], [Symbol('b'), '200'], '300'])(aSymbol);

  expect(value).toEqual('100');
});

it('should not accept undefined as expressions', async () => {
  expect(() => match([[undefined, '100'], [false, '200'], '300'])).toThrow(
    new InvalidExpressionType(undefined),
  );
});

it('should not accept function as expressions', async () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  expect(() => match([[() => {}, '100'], '300'])).toThrow(
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    new InvalidExpressionType(() => {}),
  );
});

it('should execute a function only when the expression is matched', async () => {
  const matcher = match([
    [1, 2, '100'],
    [3, 4, '200'],
    [
      5,
      () => {
        throw new Error('Should be executed');
      },
    ],
  ]);

  expect(matcher(1)).toEqual('100');
  expect(() => matcher(5)).toThrow(new Error('Should be executed'));
});

it('should compare regex expressions with strings and numbers', async () => {
  const matcher = match([[/^1/, 1, { a: 1 }, '100'], [/^b/, '200'], '300']);

  expect(matcher(1)).toEqual('100');
  expect(matcher({ a: 1 })).toEqual('100');
  expect(matcher('b')).toEqual('200');
  expect(matcher('c')).toEqual('300');
});

it('should allow function as default value', async () => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

  const matcher = match([
    [cpfRegex, 'CPF'],
    [cnpjRegex, 'CNPJ'],
    () => {
      throw new Error('Invalid document');
    },
  ]);

  expect(matcher('123.456.789-10')).toEqual('CPF');
  expect(matcher('12.345.678/9012-34')).toEqual('CNPJ');
  expect(() => matcher('123')).toThrow(new Error('Invalid document'));
});

it('should allow function that accepts as parameter the passed condition', async () => {
  const matcher = match([
    [1, 2, '100'],
    [3, 4, '200'],
    [
      5,
      (condition) => {
        expect(condition).toEqual(5);

        return (condition * 100).toString();
      },
    ],
  ]);

  expect(matcher(5)).toEqual('500');
});

it('should compare object paths with objects', async () => {
  const matcher = match([
    [
      objectPaths({
        'user.role': 'admin',
        'user.name': 'John',
      }),
      'ADMIN_ROLE',
    ],
    [
      objectPaths({
        'user.role': 'user',
      }),
      'USER_ROLE',
    ],
    'GUEST_ROLE',
  ]);

  expect(matcher({ user: { role: 'admin', name: 'John' } })).toEqual(
    'ADMIN_ROLE',
  );
  expect(matcher({ user: { role: 'admin', name: 'Jame' } })).toEqual(
    'GUEST_ROLE',
  );
  expect(matcher({ user: { role: 'user' } })).toEqual('USER_ROLE');
  expect(matcher({ user: { role: 'guest' } })).toEqual('GUEST_ROLE');
});

it('should compare array paths with arrays', async () => {
  const matcher = match([
    [
      objectPaths({
        '0.0': 1,
        '0.1': 2,
        '1.0': 3,
        '1.1': 4,
      }),
      'MATCHED',
    ],
    'NOT_MATCHED',
  ]);

  expect(
    matcher([
      [1, 2],
      [3, 4],
    ]),
  ).toEqual('MATCHED');
  expect(
    matcher([
      [1, 2],
      [3, 5],
    ]),
  ).toEqual('NOT_MATCHED');
  expect(matcher([[1, 2], [3]])).toEqual('NOT_MATCHED');
  expect(
    matcher([
      [1, 2],
      [3, 4, 5],
    ]),
  ).toEqual('MATCHED');
});
