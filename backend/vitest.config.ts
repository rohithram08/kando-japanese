import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    env: {
      DATABASE_HOST: 'localhost',
      DATABASE_USER: 'root',
      DATABASE_PASSWORD: 'password',
      DATABASE_NAME: 'nihongo_test',
      JWT_SECRET: 'test_secret_key_minimum_32_characters_long',
    },
  },
});
