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
   * 目录
   */
  Directory = 1,
  /**
   * 菜单
   */
  Menu = 2,

  /**
   * 按钮
   */
  Button = 3,
}

enum MenuLinkType {
  /**
   * 外部
   */
  Inner = 0,
  /**
   * 新窗口
   */
  NewWindow = 1,
  /**
   * 嵌入
   */
  Embed = 2,
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
  linkType: Nullable<MenuLinkType>;
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
   * 是否可见 0-显示 1-隐藏
   */
  visible: number;
}

export type { MenuDto, MenuLinkType };
