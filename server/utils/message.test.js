const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'Dani';
    const text = 'Some message';
    const message = generateMessage(from, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, text});
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'Dani';
    const lat = 1;
    const long = 1;
    const locationMessage = generateLocationMessage(from, lat, long);

    expect(locationMessage.createdAt).toBeA('number');
    expect(locationMessage.url).toBe('https://www.google.com/maps?q=1,1');
  });
})
