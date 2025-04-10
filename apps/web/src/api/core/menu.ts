import type { MenuInfo, RouteRecordStringComponent } from '@vben/types';

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
export async function getUserMenusApi() {
  return requestClient.post<MenuInfo[]>('/system/menu/user/menus');
}
