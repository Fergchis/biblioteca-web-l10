import { describe, expect, it, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  withInterceptors,
} from '@angular/common/http';
import { Biblioteca, GATEWAY } from './biblioteca';

/**
 * Estas pruebas comprueban lo único que se puede comprobar sin AWS, y es lo
 * que más se rompe: **a qué dirección le habla el frontend**.
 *
 * Apuntar `biblioteca.ts` al 3001 en vez de al 8080 no da ningún error.
 * Responde 200, con datos válidos, rodeando el gateway. Es el mismo error que se
 * comete en el backend al apuntar el BFF o el cliente al puerto de un servicio, y por
 * la misma razón: un gateway no protege lo que se puede rodear.
 */
describe('Biblioteca', () => {
  /** Guarda las URLs que salieron, y responde vacío sin tocar la red. */
  const urls: string[] = [];

  const espia: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    urls.push(req.url);
    return next(req);
  };

  beforeEach(() => {
    urls.length = 0;
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([espia]))],
    });
  });

  it('le pide el catálogo al gateway, no al microservicio', () => {
    TestBed.inject(Biblioteca).libros().subscribe({ error: () => {} });

    expect(urls).toEqual(['http://localhost:8080/v1/libros']);
    expect(urls[0]).not.toContain('3001');
  });

  it('le pide los préstamos al gateway, no al microservicio', () => {
    TestBed.inject(Biblioteca).prestamos().subscribe({ error: () => {} });

    expect(urls).toEqual(['http://localhost:8080/v1/prestamos']);
    expect(urls[0]).not.toContain('3002');
  });

  it('el gateway está en el 8080, en http, sin barra final', () => {
    expect(GATEWAY).toBe('http://localhost:8080');
  });
});
