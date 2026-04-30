import type { LucideIcon } from 'lucide-react';
import { ArrowDownWideNarrow, Plus, Search } from 'lucide-react';

import s from './NominaExplorerToolbar.module.css';

type SearchControl = {
  kind: 'search';
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

type InputControl = {
  kind: 'input';
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectControl = {
  kind: 'select';
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  withOrderIcon?: boolean;
};

type ToolbarControl = SearchControl | InputControl | SelectControl;

type ActionConfig = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
};

type Props = {
  controls: ToolbarControl[];
  onCreate?: () => void;
  createLabel?: string;
  layout?: 'periodos' | 'versiones' | 'busqueda';
  action?: ActionConfig;
};

export default function NominaExplorerToolbar({
  controls,
  onCreate,
  createLabel = 'Crear nuevo',
  layout = 'periodos',
  action,
}: Props) {
  return (
    <section className={s.toolbar}>
      <div
        className={`${s.controls} ${
          layout === 'versiones'
            ? s.versionesLayout
            : layout === 'busqueda'
              ? s.busquedaLayout
              : s.periodosLayout
        }`}
      >
        {controls.map((control) => {
          if (control.kind === 'search') {
            return (
              <label key={control.label} className={s.searchField}>
                <span className={s.fieldLabel}>{control.label}</span>
                <div className={s.searchInputWrap}>
                  <span className={s.searchIcon}>
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    value={control.value}
                    onChange={(event) => control.onChange(event.target.value)}
                    placeholder={control.placeholder}
                  />
                </div>
              </label>
            );
          }

          if (control.kind === 'input') {
            return (
              <label key={control.label} className={s.selectField}>
                <span className={s.fieldLabel}>{control.label}</span>
                <input
                  type="text"
                  className={s.plainInput}
                  value={control.value}
                  onChange={(event) => control.onChange(event.target.value)}
                  placeholder={control.placeholder}
                />
              </label>
            );
          }

          return (
            <label key={control.label} className={s.selectField}>
              <span className={s.fieldLabel}>{control.label}</span>
              {control.withOrderIcon ? (
                <div className={s.selectWithIcon}>
                  <span className={s.orderIcon}>
                    <ArrowDownWideNarrow size={15} />
                  </span>
                  <select
                    value={control.value}
                    onChange={(event) => control.onChange(event.target.value)}
                  >
                    {control.options.map((option, index) => (
                      <option
                        key={`${control.label}-${option.value || 'empty'}-${index}`}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <select
                  value={control.value}
                  onChange={(event) => control.onChange(event.target.value)}
                >
                  {control.options.map((option, index) => (
                    <option
                      key={`${control.label}-${option.value || 'empty'}-${index}`}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </label>
          );
        })}

        {action ? (
          <div className={s.actions}>
            <button
              type="button"
              className={s.createButton}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon ? <action.icon size={16} /> : null}
              <span>{action.label}</span>
            </button>
          </div>
        ) : null}

        {onCreate ? (
          <div className={s.actions}>
            <button type="button" className={s.createButton} onClick={onCreate}>
              <Plus size={16} />
              <span>{createLabel}</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
