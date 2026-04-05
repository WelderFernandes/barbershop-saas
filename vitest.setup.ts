import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock do Next.js Auth e Headers se necessário
vi.mock("next/headers", () => ({
  headers: vi.fn(() => ({
    get: vi.fn(),
  })),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));
