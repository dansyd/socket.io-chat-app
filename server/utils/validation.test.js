const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const res = isRealString(900);
    expect(res).toBe(false);
  });
  it('should reject string with only spaces', () => {
    const res = isRealString('   ');
    expect(res).toBe(false);
  });
  it('should allow string wiht non-space character', () => {
    const res = isRealString('   Cmon lets go   ');
    expect(res).toBe(true);
  });
});
