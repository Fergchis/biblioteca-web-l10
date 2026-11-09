import { describe, expect, it } from 'vitest';
import { routes } from './app.routes';

/**
 * Una ruta que no está declarada no existe, y el síntoma es un 404 del router
 * con el archivo del componente perfecto. Es el mismo error que en Nest con
 * `app.module.ts`: existir no basta, hay que registrarse.
 */
describe('las rutas', () => {
  const caminos = routes.map((r) => r.path);

  it('declara catálogo, préstamos y el callback', () => {
    expect(caminos).toContain('libros');
    expect(caminos).toContain('prestamos');
    expect(caminos).toContain('callback');
  });

  it('la raíz redirige al catálogo', () => {
    const raiz = routes.find((r) => r.path === '');
    expect(raiz?.redirectTo).toBe('libros');
    expect(raiz?.pathMatch).toBe('full');
  });

  /**
   * El `callback` tiene que ser exactamente eso: la Allowed callback URL que
   * registraste en Cognito es `http://localhost:4200/callback`, y la
   * coincidencia es **exacta**, carácter por carácter. Un `auth/callback` acá
   * y un `callback` allá dan `redirect_mismatch`.
   */
  it('el callback se llama «callback», sin prefijos', () => {
    expect(caminos).toContain('callback');
    expect(caminos.some((c) => c?.endsWith('/callback'))).toBe(false);
  });
});
