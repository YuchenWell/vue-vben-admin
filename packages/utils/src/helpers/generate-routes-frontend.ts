import type { RouteRecordRaw } from 'vue-router';

import { filterTree, mapTree } from '@vben-core/shared/utils';

/**
 * 动态生成路由 - 前端方式
 */
async function generateRoutesByFrontend(
  routes: RouteRecordRaw[],
  userRoles: string[] = [],
  userPermissions: string[] = [],
  forbiddenComponent?: RouteRecordRaw['component'],
): Promise<RouteRecordRaw[]> {
  // 根据角色标识过滤路由表,判断当前用户是否拥有指定权限
  const finalRoutes = filterTree(routes, (route) => {
    return hasAuthority(route, userRoles, userPermissions);
  });

  if (!forbiddenComponent) {
    return finalRoutes;
  }

  // 如果有禁止访问的页面，将禁止访问的页面替换为403页面
  return mapTree(finalRoutes, (route) => {
    if (menuHasVisibleWithForbidden(route)) {
      route.component = forbiddenComponent;
    }
    return route;
  });
}

/**
 * 判断路由是否有权限访问
 * @param route
 * @param access
 */
function hasAuthority(
  route: RouteRecordRaw,
  userRoles: string[] = [],
  userPermissions: string[] = [],
) {
  const authority = route.meta?.authority;
  const permission = route.meta?.permission;

  if (!authority && !permission) {
    return true;
  }

  let canAccess = true;

  if (permission && !isIntersection(userPermissions, [permission])) {
    canAccess = false;
  }

  if (authority && !isIntersection(userRoles, authority)) {
    canAccess = false;
  }

  return canAccess || (!canAccess && menuHasVisibleWithForbidden(route));
}

function isIntersection(arr1: string[], arr2: string[]) {
  return arr1.some((value) => arr2.includes(value));
}

/**
 * 判断路由是否在菜单中显示，但是访问会被重定向到403
 * @param route
 */
function menuHasVisibleWithForbidden(route: RouteRecordRaw) {
  return (
    !!route.meta?.authority &&
    Reflect.has(route.meta || {}, 'menuVisibleWithForbidden') &&
    !!route.meta?.menuVisibleWithForbidden
  );
}

export { generateRoutesByFrontend, hasAuthority };
