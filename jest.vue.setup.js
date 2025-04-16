// Mock Vue SSR Utils
jest.mock('@vue/server-renderer', () => ({
  renderToString: jest.fn(),
  ssrUtils: {
    ensureValidVNode: jest.fn(),
    initDirectivesForSSR: jest.fn()
  }
}));

// Mock Vue defineComponent to simplify testing
jest.mock('vue', () => {
  const originalVue = jest.requireActual('vue');
  return {
    ...originalVue,
    // Use a mock implementation that just returns the options
    defineComponent: jest.fn(options => options),
    nextTick: jest.fn(() => Promise.resolve())
  };
});

// Configure global settings without modifying read-only properties
jest.mock('@vue/test-utils', () => {
  const VueTestUtils = jest.requireActual('@vue/test-utils');
  return {
    ...VueTestUtils,
    config: {
      global: {
        plugins: [],
        components: {},
        directives: {},
        mocks: {}
      }
    }
  };
});
