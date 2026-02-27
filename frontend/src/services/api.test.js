import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';

// Mock axios
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })),
    },
  };
});

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an axios instance', () => {
    expect(api).toBeDefined();
    expect(api.interceptors).toBeDefined();
  });
});
