'use client';

import s from './QuickAccessSection.module.css';
import {
  FiBriefcase,
  FiMonitor,
  FiActivity,
  FiAward,
  FiUser,
  FiCalendar,
  FiPercent,
  FiFilm,
  FiArrowRight,
} from 'react-icons/fi';

type Item = {
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  {
    title: 'Viajes Turísticos',
    desc: 'Consulta destinos y beneficios disponibles.',
    href: '#',
    icon: <FiBriefcase />,
  },
  {
    title: 'DeclaraNET',
    desc: 'Presenta tu declaración patrimonial en línea.',
    href: '#',
    icon: <FiMonitor />,
  },
  {
    title: 'Deportes',
    desc: 'Registra tu participación en actividades.',
    href: '#',
    icon: <FiActivity />,
  },
  {
    title: 'Sistema de Escalafón',
    desc: 'Consulta tu proceso y resultados.',
    href: '#',
    icon: <FiAward />,
  },
  {
    title: 'Prestaciones ISSEMYM',
    desc: 'Trámites y estado de beneficios.',
    href: '#',
    icon: <FiUser />,
  },
  {
    title: 'Cine Club',
    desc: 'Consulta funciones disponibles.',
    href: '#',
    icon: <FiFilm />,
  },
  {
    title: 'Descuentos',
    desc: 'Beneficios vigentes para servidores.',
    href: '#',
    icon: <FiPercent />,
  },
  {
    title: 'Boletos para Festivales',
    desc: 'Compra y consulta eventos culturales.',
    href: '#',
    icon: <FiCalendar />,
  },
];

export default function QuickAccessSection() {
  return (
    <section className={s.wrap}>
      <div className={s.inner}>
        <header className={s.header}>
          <h2>Accesos Rápidos</h2>
          <p>Ingresa directamente a los sistemas institucionales.</p>
        </header>

        <div className={s.grid}>
          {items.map((item) => (
            <a key={item.title} href={item.href} className={s.card}>
              <div className={s.icon}>{item.icon}</div>

              <div className={s.content}>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>

              <FiArrowRight className={s.arrow} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
