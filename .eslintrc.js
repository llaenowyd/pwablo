module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    'prettier/prettier': 0,
    semi: [0, 'never'],
    'comma-dangle': [1, {
      'arrays': 'never',
      'objects': 'never',
      'imports': 'never',
      'exports': 'never',
      'functions': 'never'
    }],
    'space-infix-ops': ['off'],
    curly: 'off',
    'no-shadow': 'off'
  },
};

