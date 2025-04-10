import type { RouteRecordRaw } from 'vue-router';

import type {
  GenerateMenuAndRoutesOptions,
  MenuInfo,
  MenuRecordRaw,
} from '@vben-core/typings';

import { filterTree, recursiveTree } from '@vben-core/shared/utils';

/**
 * 根据后端接口配置生成菜单列表
 * @param routes
 */
async function generateMenusByBackend(
  routes: RouteRecordRaw[],
  options: GenerateMenuAndRoutesOptions,
): Promise<MenuRecordRaw[]> {
  const { fetchUserMenuListAsync } = options;

  if (!fetchUserMenuListAsync) {
    throw new Error('fetchUserMenuListAsync is required');
  }

  const userMenus = await fetchUserMenuListAsync();

  const permissionRouteMap = getRouteByPermissionMap(routes);

  const menus: MenuRecordRaw[] = userMenus
    .map((menu) => buildMenu(menu, permissionRouteMap))
    .filter((menu) => !!menu)
    .sort((a, b) => (a?.order ?? 999) - (b?.order ?? 999));

  const finalMenus = filterTree(menus, (menu) => !!menu.show);

  return finalMenus;
}

const getRouteByPermissionMap = (
  routes: RouteRecordRaw[],
): Map<string, RouteRecordRaw> => {
  const map = new Map<string, RouteRecordRaw>();

  recursiveTree(routes, (route) => {
    if (route.meta?.permission) {
      map.set(route.meta?.permission, route);
    }
  });

  return map;
};

const buildMenu = (
  userMenu: MenuInfo,
  permissionRouteMap: Map<string, RouteRecordRaw>,
  parentPath?: string,
): MenuRecordRaw | null => {
  const route = permissionRouteMap.get(userMenu.permission);

  if (!route) {
    console.error(`权限 ${userMenu.permission} 没有找到对应的路由`);
    return null;
  }

  // 转换为菜单结构
  const { meta: routeMeta, redirect, path } = route;

  // 隐藏子菜单
  const resultPath = routeMeta?.hideChildrenInMenu ? redirect || path : path;

  // 将菜单的所有父级和父级菜单记录到菜单项内
  if (userMenu.menus && userMenu.menus.length > 0) {
    userMenu.menus.forEach((child) => (child.parent = path));
  }

  const children: MenuRecordRaw[] = userMenu.menus
    ? userMenu.menus
        .map((child) => buildMenu(child, permissionRouteMap, path))
        .filter((child) => !!child)
    : [];

  const menuRecordRaw: MenuRecordRaw = {
    activeIcon: userMenu.icon ?? '',
    badge: routeMeta?.badge,
    badgeType: routeMeta?.badgeType,
    badgeVariants: routeMeta?.badgeVariants,
    children,
    icon: userMenu.icon ?? '',
    name: userMenu.menuName || routeMeta?.title || '',
    order: userMenu.menuSort,
    parent: parentPath,
    path: resultPath as string,
    show: !route?.meta?.hideInMenu,
  };

  return menuRecordRaw;
};

export { generateMenusByBackend };
