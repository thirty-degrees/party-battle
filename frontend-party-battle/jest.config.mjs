export default {
  preset: 'jest-expo',
  reporters: [
    'default',
    ['jest-junit', {
      outputName: 'test-results.xml'
    }]
  ]
};
