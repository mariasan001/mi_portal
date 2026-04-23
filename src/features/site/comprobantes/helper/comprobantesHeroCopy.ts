import type { ComprobantesHeroView } from '../types/comprobantes.types';

type HeroCopy = {
  title: string;
  accent: string;
  subtitleStrong: string;
  subtitle: string;
};

export function buildHeroCopy(view: ComprobantesHeroView): HeroCopy {
  if (view === 'menu') {
    return {
      title: 'Hola,',
      accent: 'Maria Sandoval',
      subtitleStrong: 'Nos da mucho gusto tenerte aquí.',
      subtitle:
        'Desde este portal podrás consultar tus comprobantes, constancias, movimientos de personal y demás servicios digitales disponibles para ti.',
    };
  }

  if (view === 'comprobante-quincenal') {
    return {
      title: 'Comprobante',
      accent: 'quincenal',
      subtitleStrong: 'Consulta tu documento de forma clara y rápida.',
      subtitle:
        'Completa el formulario correspondiente para consultar y descargar tu comprobante de percepciones y deducciones.',
    };
  }

  if (view === 'constancia-quincenal') {
    return {
      title: 'Constancia',
      accent: 'quincenal',
      subtitleStrong: 'Consulta tu constancia en formato digital.',
      subtitle:
        'Selecciona esta opción para acceder a tu constancia quincenal correspondiente.',
    };
  }

  if (view === 'constancia-anualizada') {
    return {
      title: 'Constancia',
      accent: 'anualizada',
      subtitleStrong: 'Consulta tu documento anualizado.',
      subtitle:
        'En este apartado podrás obtener la constancia anualizada con la información correspondiente.',
    };
  }

  return {
    title: 'Comprobantes',
    accent: 'CFDI',
    subtitleStrong: 'Consulta tus CFDI disponibles.',
    subtitle:
      'Aquí podrás consultar y descargar tus comprobantes fiscales digitales desde el sistema.',
  };
}
