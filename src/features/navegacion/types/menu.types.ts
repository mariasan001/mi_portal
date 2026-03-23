export type MenuItem = {
  code: string;
  name: string;
  route: string;
  icon: string;
  description?: string;
  orderIndex?: number;
  active?: boolean;
  children?: MenuItem[];
};

export type MenuResponse = {
  appCode: string;
  items: MenuItem[];
};