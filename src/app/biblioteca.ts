import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * La dirección del gateway de L1. **Un solo lugar en todo el proyecto.**
 *
 * Fíjate en lo que no aparece acá: los puertos 3001 y 3002. El frontend no
 * sabe —ni tiene por qué saber— que detrás del 8080 hay dos microservicios.
 * Eso es exactamente lo que un gateway hace por ti.
 */
export const GATEWAY = 'http://localhost:8080';

export type Libro = {
  id: number;
  titulo: string;
  autor: string;
  anio: number;
  copias: number;
};

export type Prestamo = {
  id: number;
  libroId: number;
  lector: string;
  vence: string;
  devuelto: boolean;
};

/**
 * El único que habla con el gateway.
 *
 * No hay un solo `Authorization` en este archivo, y es a propósito: adjuntar el
 * token no es trabajo del servicio. Lo hace el **interceptor** que escribes en
 * el tramo 8.7, una vez, para todas las peticiones. Un servicio que arma su
 * propio header es un servicio que hay que arreglar en treinta lugares el día
 * que cambie algo.
 */
@Injectable({ providedIn: 'root' })
export class Biblioteca {
  private readonly http = inject(HttpClient);

  libros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${GATEWAY}/v1/libros`);
  }

  prestamos(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(`${GATEWAY}/v1/prestamos`);
  }
}
