// __mocks__/lucide-react.js
module.exports = new Proxy({}, {
    get: function(target, property) {
      return function MockIcon() {
        return null;
      };
    }
  });