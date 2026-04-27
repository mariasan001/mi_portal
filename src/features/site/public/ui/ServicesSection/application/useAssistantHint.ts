import { useEffect, useState } from 'react';

type AssistantAction = 'tramite' | 'consulta' | 'password' | null;

export function useAssistantHint() {
  const [assistantHint, setAssistantHint] = useState<string>('');

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ action: AssistantAction }>;
      const action = customEvent.detail?.action;

      if (action !== 'tramite' && action !== 'consulta') return;

      const section = document.getElementById('services-section');
      if (!section) return;

      section.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (action === 'tramite') {
        setAssistantHint('Aqui podras realizar tramites relacionados con lo que buscas.');
      }

      if (action === 'consulta') {
        setAssistantHint('Aqui podras consultar informacion y acceder al servicio adecuado.');
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setAssistantHint(''), 5000);
    };

    window.addEventListener(
      'portal-assistant:navigate',
      handleNavigate as EventListener
    );

    return () => {
      window.removeEventListener(
        'portal-assistant:navigate',
        handleNavigate as EventListener
      );
      clearTimeout(timeoutId);
    };
  }, []);

  return { assistantHint };
}
