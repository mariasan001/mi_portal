import { ArrowDownWideNarrow, Plus, Search } from 'lucide-react';

import s from './NominaExplorerToolbar.module.css';

type SearchControl = {
  kind: 'search';
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

type ToolbarControl = SearchControl | SelectControl;

type Props = {
  controls: ToolbarControl[];
  onCreate: () => void;
  createLabel?: string;
  layout?: 'periodos' | 'versiones';
};

export default function NominaExplorerToolbar({
  controls,
  onCreate,
  createLabel = 'Crear nuevo',
  layout = 'periodos',
}: Props) {
  return (
    <section className={s.toolbar}>
      <div className={`${s.controls} ${layout === 'versiones' ? s.versionesLayout : s.periodosLayout}`}>
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
                    {control.options.map((option) => (
                      <option key={option.value} value={option.value}>
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
                  {control.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </label>
          );
        })}

        <div className={s.actions}>
          <button type="button" className={s.createButton} onClick={onCreate}>
            <Plus size={16} />
            <span>{createLabel}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
