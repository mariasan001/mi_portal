import React from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  Activity,
  BadgeCheck,
  BookCopy,
  CalendarRange,
  ChartNoAxesColumn,
  CircleHelp,
  ClipboardCheck,
  ClipboardList,
  Eye,
  FileSearch,
  FolderSearch,
  GitBranch,
  Home,
  Radar,
  Receipt,
  Rocket,
  ScanEye,
  ScanSearch,
  Search,
  Settings,
  ShieldCheck,
  TimerReset,
  Upload,
  Users,
  Workflow,
} from 'lucide-react';

const MENU_ICON_REGISTRY: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  workflow: Workflow,
  settings: Settings,
  upload: Upload,
  search: Search,
  receipt: Receipt,
  calendar: CalendarRange,
  gitbranch: GitBranch,
  bookcopy: BookCopy,
  filesearch: FileSearch,
  foldersearch: FolderSearch,
  clipboardlist: ClipboardList,
  clipboardcheck: ClipboardCheck,
  scansearch: ScanSearch,
  eye: Eye,
  badgecheck: BadgeCheck,
  activity: Activity,
  chartnoaxescolumn: ChartNoAxesColumn,
  radar: Radar,
  scaneye: ScanEye,
  timerreset: TimerReset,
  rocket: Rocket,
  shieldcheck: ShieldCheck,
  Home,
  Users,
  Workflow,
  Settings,
  Upload,
  Search,
  Receipt,
  CalendarRange,
  GitBranch,
  BookCopy,
  FileSearch,
  FolderSearch,
  ClipboardList,
  ClipboardCheck,
  ScanSearch,
  Eye,
  BadgeCheck,
  Activity,
  ChartNoAxesColumn,
  Radar,
  ScanEye,
  TimerReset,
  Rocket,
  ShieldCheck,
};

function normalizeIconName(iconName: string | null | undefined) {
  return (iconName ?? '').trim();
}

export function renderMenuIcon(
  iconName: string | null | undefined,
  props?: LucideProps
): ReactNode {
  const normalizedName = normalizeIconName(iconName);
  const IconComponent =
    MENU_ICON_REGISTRY[normalizedName] ??
    MENU_ICON_REGISTRY[normalizedName.toLowerCase()] ??
    CircleHelp;

  return React.createElement(IconComponent, props);
}
