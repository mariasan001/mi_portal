import type {
  ComprobantesHeroCopy,
  ComprobantesHeroView,
} from './comprobantes.types';

export function buildHeroCopy(view: ComprobantesHeroView): ComprobantesHeroCopy {
  if (view === 'menu') {
    return {
      title: 'Hola,',
      accent: 'Maria Sandoval',
      subtitleStrong: 'Nos da mucho gusto tenerte aqui.',
      subtitle:
        'Desde este portal podras consultar tus comprobantes, constancias, movimientos de personal y demas servicios digitales disponibles para ti.',
    };
  }

  if (view === 'comprobante-quincenal') {
    return {
      title: 'Comprobante',
      accent: 'quincenal',
      subtitleStrong: 'Consulta tu documento de forma clara y rapida.',
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
        'Selecciona esta opcion para acceder a tu constancia quincenal correspondiente.',
    };
  }

  if (view === 'constancia-anualizada') {
    return {
      title: 'Constancia',
      accent: 'anualizada',
      subtitleStrong: 'Consulta tu documento anualizado.',
      subtitle:
        'En este apartado podras obtener la constancia anualizada con la informacion correspondiente.',
    };
  }

  return {
    title: 'Comprobantes',
    accent: 'CFDI',
    subtitleStrong: 'Consulta tus CFDI disponibles.',
    subtitle:
      'Aqui podras consultar y descargar tus comprobantes fiscales digitales desde el sistema.',
  };
}
