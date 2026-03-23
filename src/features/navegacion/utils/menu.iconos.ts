import React from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  BookCopy,
  CalendarRange,
  CircleHelp,
  ClipboardList,
  FileSearch,
  FolderSearch,
  GitBranch,
  Home,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  Upload,
  Users,
  Workflow,
} from 'lucide-react';

const ICONOS: Record<string, LucideIcon> = {
  // aliases simples
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
  shieldcheck: ShieldCheck,

  // nombres exactos que puede mandar el backend
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
  ShieldCheck,
};

function normalizeIconName(value: string | null | undefined) {
  return (value ?? '').trim();
}

/**
 * Devuelve un ReactNode ya construido.
 * Así evitamos crear componentes inline en pleno render del sidebar.
 */
export function renderIcon(
  name: string | null | undefined,
  props?: LucideProps
): ReactNode {
  const raw = normalizeIconName(name);

  const Comp =
    ICONOS[raw] ??
    ICONOS[raw.toLowerCase()] ??
    CircleHelp;

  return React.createElement(Comp, props);
}