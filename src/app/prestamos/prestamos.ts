import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Biblioteca, Prestamo } from '../biblioteca';

/**
 * La pieza gemela de `libros`. Mismo patrón, otra ruta.
 *
 * En el gateway, esta ruta es la que exige **además** el grupo
 * `bibliotecarios` (tramo 7.4). Por eso es la que te va a dar 403 cuando
 * entres con `invitado@biblioteca.test`, que quedó en `lectores`: mismo token
 * válido, distinto rol.
 */
@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.html',
})
export class Prestamos {
  private readonly biblioteca = inject(Biblioteca);

  protected readonly prestamos = signal<Prestamo[]>([]);
  protected readonly estado = signal<number | null>(null);
  protected readonly cargando = signal(true);

  constructor() {
    this.biblioteca.prestamos().subscribe({
      next: (prestamos) => {
        this.prestamos.set(prestamos);
        this.estado.set(200);
        this.cargando.set(false);
      },
      error: (e: HttpErrorResponse) => {
        this.estado.set(e.status);
        this.cargando.set(false);
      },
    });
  }
}
