const isRealString = (str) => {
  debugger;
  return typeof str === 'string' && str.trim().length > 0;
};

module.exports = {isRealString};
