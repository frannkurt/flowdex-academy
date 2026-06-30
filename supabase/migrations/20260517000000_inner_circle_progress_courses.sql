INSERT INTO public.courses (name, description, price, slug)
VALUES
  (
    'Inner Circle · Inversiones (Progreso)',
    'Curso tecnico interno para persistir progreso remoto de la disciplina de inversiones de Inner Circle.',
    0,
    'inner-circle-inversiones'
  ),
  (
    'Inner Circle · Trading (Progreso)',
    'Curso tecnico interno para persistir progreso remoto de la disciplina de trading de Inner Circle.',
    0,
    'inner-circle-trading'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;
