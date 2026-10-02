import { useEffect, useState } from 'react';

/** Escribe y borra cada frase en bucle, como si alguien tecleara. */
export function useTypewriter(phrases: readonly string[], { typeMs = 70, deleteMs = 35, pauseMs = 1800 } = {}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[index % phrases.length] ?? '';

    if (!deleting && text === phrase) {
      const timeout = setTimeout(() => setDeleting(true), pauseMs);
      return () => clearTimeout(timeout);
    }
    if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => i + 1);
      return;
    }

    const timeout = setTimeout(
      () => setText(deleting ? phrase.slice(0, text.length - 1) : phrase.slice(0, text.length + 1)),
      deleting ? deleteMs : typeMs,
    );
    return () => clearTimeout(timeout);
  }, [text, deleting, index, phrases, typeMs, deleteMs, pauseMs]);

  return text;
}
