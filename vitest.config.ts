import { defineConfig } from "vitest/config"
import path from "node:path"

// Config base de Vitest para tests del lado server.
// Environment node porque testeamos API routes y lógica de negocio, no UI.
// Si en el futuro agregamos tests de componentes React, conviene un segundo
// config con environment jsdom o happy-dom.
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["__tests__/**/*.test.ts", "__tests__/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
