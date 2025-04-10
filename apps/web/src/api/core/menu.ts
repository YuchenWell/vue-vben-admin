import type { MenuDto, RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 后端生成路由 - 获取用户所有菜单
 */
export async function getAllMenusApi(): Promise<RouteRecordStringComponent[]> {
  throw new Error('not implemented');
}

/**
 * 后端过滤路由 - 获取用户所有菜单
 */
export async function getBackendMenusApi() {
  return requestClient.post<MenuDto[]>('/system/menu/user/menus');
}
