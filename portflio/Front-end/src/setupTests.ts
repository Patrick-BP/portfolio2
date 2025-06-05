
import '@testing-library/jest-dom';

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  root = null;
  rootMargin = '';
  thresholds = [];

  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
}

global.IntersectionObserver = class IntersectionObserver extends MockIntersectionObserver {
  takeRecords() {
    return [];
  }
} as unknown as typeof IntersectionObserver;
