export type MenuItem = {
  code: string;
  name: string;
  route: string;
  icon: string;
  children?: MenuItem[];
};

export type MenuResponse = {
  appCode: string;
  items: MenuItem[];
};
