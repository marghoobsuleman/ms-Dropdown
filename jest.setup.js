// Setup test environment
require('@testing-library/jest-dom');

// Import Vue for SSR Utils
import * as Vue from 'vue';

// Mock Vue SSR Utils
Vue.ssrUtils = {
  ensureValidVNode: () => {}
};

// Add custom jest matchers
expect.extend({
  toHaveBeenCalledAfter(received, expected) {
    const pass = received.mock.invocationCallOrder[0] > expected.mock.invocationCallOrder[0];
    return {
      pass,
      message: () => `expected ${received.getMockName()} to have been called after ${expected.getMockName()}`
    };
  }
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
