interface BasicOption {
  label: string;
  value: string;
}

type SelectOption = BasicOption;

type TabOption = BasicOption;

interface BasicUserInfo {
  /**
   * 邮箱
   */
  email: string;

  /**
   * 权限
   */
  permissions?: string[];
  /**
   * 手机号
   */
  phone: string;

  /**
   * 用户角色
   */
  roles?: string[];

  /**
   * 员工编号
   */
  staffNo: string;

  /**
   * 用户id
   */
  userId: string;

  /**
   * 用户名
   */
  userName: string;
}

type ClassType = Array<object | string> | object | string;

export type { BasicOption, BasicUserInfo, ClassType, SelectOption, TabOption };
