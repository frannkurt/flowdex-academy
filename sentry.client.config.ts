// Archivo movido a instrumentation-client.ts (mayo 2026).
//
// En @sentry/nextjs v10+ con Turbopack (Next 16 default), este nombre de archivo
// ya no se detecta automáticamente — solo funcionaba con webpack. El patrón
// canónico actual es instrumentation-client.ts en root del proyecto.
//
// Se deja vacío en lugar de eliminarse para evitar errores de import cruzados
// si algún build legacy lo busca; podés borrarlo manualmente cuando confirmes
// que ningún script lo referencia.
export {}
