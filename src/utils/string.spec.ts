import './string';

describe('Utils: String', () => {
  test('Format as Array', () => {
    expect('12{0}567{1} {1}{0}{2}'.format('34', 8, 55)).toEqual('12345678 83455');
  });

  test('Format as Object', () => {
    expect('12{f}567{d} {d}{f}{c}'.format({ f: '34', d: 8, c: 55, m: 44 })).toEqual(
      '12345678 83455',
    );
  });
});
