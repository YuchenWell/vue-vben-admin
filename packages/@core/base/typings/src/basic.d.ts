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
   * 默认首页
   */
  homePath?: string;
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

interface BaseModel {
  /**
   * 创建人
   */
  createBy: string;
  /**
   * 创建人名称
   */
  createByName: string;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 主键
   */
  id: string;
  /**
   * 更新人工号
   */
  updateBy: string;
  /**
   * 更新人名称
   */
  updateByName: string;
  /**
   * 更新时间
   */
  updateTime: string;
}

type ClassType = Array<object | string> | object | string;

export type {
  BaseModel,
  BasicOption,
  BasicUserInfo,
  ClassType,
  SelectOption,
  TabOption,
};
