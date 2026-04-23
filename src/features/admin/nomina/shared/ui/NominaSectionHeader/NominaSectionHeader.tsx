import { cx } from '@/utils/cx';
import s from './NominaSectionHeader.module.css';

type SummaryItem = {
  label: string;
  value: string;
};

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  status?: string;
  summaryItems?: SummaryItem[];
  showSummary?: boolean;
  summaryColumns?: 2 | 3;
};

export default function NominaSectionHeader({
  eyebrow,
  title,
  description,
  status,
  summaryItems = [],
  showSummary = false,
  summaryColumns = 3,
}: Props) {
  const shouldShowSummary = showSummary && (Boolean(status) || summaryItems.length > 0);

  return (
    <section className={s.wrapper}>
      <div className={cx(s.header, s.enter)}>
        <div className={s.copy}>
          <span className={cx(s.eyebrow, s.enterLeft)}>{eyebrow}</span>
          <h3 className={cx(s.title, s.enterSoft)}>{title}</h3>
          {description ? <p className={cx(s.description, s.enterSoftDelay)}>{description}</p> : null}
        </div>
      </div>

      {shouldShowSummary ? (
        <div className={cx(s.summaryBlock, s.enterSoft)}>
          {status ? (
            <div className={s.statusBox}>
              <span className={s.statusLabel}>Estado general</span>
              <strong>{status}</strong>
            </div>
          ) : null}

          {summaryItems.length ? (
            <div className={cx(s.summaryGrid, summaryColumns === 2 ? s.cols2 : s.cols3)}>
              {summaryItems.map((item) => (
                <div className={s.summaryItem} key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
