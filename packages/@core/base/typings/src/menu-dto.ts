import type { BaseModel } from './basic';
import type { Nullable } from './helper';

enum YesNoNumberEnum {
  /**
   * 是
   */
  YES = 1,

  /**
   * 否
   */
  NO = 0,
}

enum MenuType {
  /**
   * 按钮
   */
  Button = 3,
  /**
   * 目录
   */
  Directory = 1,
  /**
   * 菜单
   */
  Menu = 2,
}

enum LinkType {
  /**
   * 外部
   */
  External = 1,
  /**
   * 内部
   */
  Internal = 0,
}

enum MenuVisibleEnum {
  /**
   * 显示
   */
  Visible = 0,
  /**
   * 隐藏
   */
  Hidden = 1,
}

/**
 * 菜单信息
 */
interface MenuDto extends BaseModel {
  /**
   * 菜单图标
   */
  icon: Nullable<string>;
  /**
   * 菜单链接
   */
  link: Nullable<string>;
  /**
   * 链接类型 0-内部 1-外部
   */
  linkType: Nullable<LinkType>;
  /**
   * 菜单名称
   */
  menuName: string;
  /**
   * 子菜单
   */
  menus: Nullable<MenuDto[]>;
  /**
   * 菜单排序
   */
  menuSort: number;
  /**
   * 菜单类型
   */
  menuType: Nullable<MenuType>;
  /**
   * 父级菜单
   */
  parent?: string;
  /**
   * 权限
   */
  permission: string;
  /**
   * 状态
   */
  status: YesNoNumberEnum;

  /**
   * 是否可见
   */
  visible: MenuVisibleEnum;
}

export type { MenuDto };
