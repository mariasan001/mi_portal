export type MenuItem = {
  id: number;
  code: string;
  name: string;
  route: string;
  icon: string;
  children: MenuItem[];
};

export type MenuResponse = {
  appCode: string;
  items: MenuItem[];
};
