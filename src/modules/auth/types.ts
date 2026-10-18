import type { paths } from '@/interfaces/generated/api';

export type LoginInput =
  paths['/login']['post']['requestBody']['content']['application/json'];

export type RegisterInput =
  paths['/users']['post']['requestBody']['content']['application/json'];
