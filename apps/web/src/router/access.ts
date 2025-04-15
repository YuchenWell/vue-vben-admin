import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { useAppConfig } from '@vben/hooks';
import { preferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { getAllMenusApi, getBackendMenusApi } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
  };

  const accessStore = useAccessStore();
  const { v2URL } = useAppConfig(import.meta.env, import.meta.env.PROD);

  return await generateAccessible(
    preferences.app.accessMode,
    preferences.app.menuMode,
    {
      ...options,
      fetchMenuListAsync: async () => {
        message.loading({
          content: `${$t('common.loadingMenu')}...`,
          duration: 0.5,
        });
        return await getAllMenusApi();
      },
      getBackendMenuListAsync: async () => {
        message.loading({
          content: `${$t('common.loadingMenu')}...`,
          duration: 0.5,
        });
        return await getBackendMenusApi();
      },
      getV2Url: (pagePermission: string) => {
        return `${v2URL}/#/embed-in-v3?token=${accessStore.accessToken}&pagePermission=${pagePermission}`;
      },
      // 可以指定没有权限跳转403页面
      forbiddenComponent,
      // 如果 route.meta.menuVisibleWithForbidden = true
      layoutMap,
      pageMap,
    },
  );
}

export { generateAccess };
