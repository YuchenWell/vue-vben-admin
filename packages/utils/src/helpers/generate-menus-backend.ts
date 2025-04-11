import type { RouteRecordRaw } from 'vue-router';

import type {
  GenerateMenuAndRoutesOptions,
  MenuDto,
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
  const { getBackendMenuListAsync } = options;

  if (!getBackendMenuListAsync) {
    throw new Error('getBackendMenuListAsync is required');
  }

  const menuDtos = await getBackendMenuListAsync();

  const permissionRouteMap = getRouteByPermissionMap(routes);

  const menus: MenuRecordRaw[] = menuDtos
    .map((menuDto) => {
      return buildMenu({ menuDto, permissionRouteMap, routes, options });
    })
    .filter((menuDto) => !!menuDto)
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
  data: {
    menuDto: MenuDto;
    options: GenerateMenuAndRoutesOptions;
    permissionRouteMap: Map<string, RouteRecordRaw>;
    routes: RouteRecordRaw[];
  },
  parentPath?: string,
): MenuRecordRaw | null => {
  const { menuDto, permissionRouteMap } = data;
  const route = permissionRouteMap.get(menuDto.permission);

  if (!route) {
    console.error(`权限 ${menuDto.permission} 没有找到对应的路由`);
    return null;
  }

  // 转换为菜单结构
  const { meta: routeMeta, redirect, path } = route;

  // 隐藏子菜单
  const resultPath = routeMeta?.hideChildrenInMenu ? redirect || path : path;

  // 将菜单的所有父级和父级菜单记录到菜单项内
  if (menuDto.menus && menuDto.menus.length > 0) {
    menuDto.menus.forEach((child) => (child.parent = path));
  }

  const children: MenuRecordRaw[] = menuDto.menus
    ? menuDto.menus
        .map((child) => buildMenu({ ...data, menuDto: child }, path))
        .filter((child) => !!child)
    : [];

  const menuTitle = menuDto.menuName || routeMeta?.title || '';
  if (routeMeta) {
    routeMeta.title = menuTitle;
  }

  const menuRecordRaw: MenuRecordRaw = {
    activeIcon: routeMeta?.activeIcon ?? '',
    badge: routeMeta?.badge,
    badgeType: routeMeta?.badgeType,
    badgeVariants: routeMeta?.badgeVariants,
    children,
    icon: routeMeta?.icon ?? '',
    name: menuTitle,
    order: menuDto.menuSort,
    parent: parentPath,
    path: resultPath as string,
    show: !route?.meta?.hideInMenu,
  };

  return menuRecordRaw;
};

export { generateMenusByBackend };
