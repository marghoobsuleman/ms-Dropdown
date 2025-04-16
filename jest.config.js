// Suppress punycode deprecation warning in Node.js
process.env.NODE_OPTIONS = '--no-deprecation';

module.exports = {
  // Mock Vue for non-Vue tests
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.esm-bundler.js',
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  // Only use Vue setup for Vue tests
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/jest.vue.setup.js'
  ],

  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!vue)/'
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/frameworks/**/*.{js,jsx,vue,ts,tsx}',
    '!src/frameworks/**/__tests__/**'
  ],
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  globals: {
    'vue-jest': {
      compilerOptions: {
        isCustomElement: (tag) => tag.startsWith('ms-')
      }
    }
  }
};
