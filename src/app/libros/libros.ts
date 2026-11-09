import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Biblioteca, Libro } from '../biblioteca';

@Component({
  selector: 'app-libros',
  templateUrl: './libros.html',
})
export class Libros {
  private readonly biblioteca = inject(Biblioteca);

  protected readonly libros = signal<Libro[]>([]);
  protected readonly estado = signal<number | null>(null);
  protected readonly cargando = signal(true);

  constructor() {
    this.biblioteca.libros().subscribe({
      next: (libros) => {
        this.libros.set(libros);
        this.estado.set(200);
        this.cargando.set(false);
      },
      // El error **no se esconde**: se muestra con su código. Un 401 y un 403
      // dicen cosas distintas, y en este laboratorio esa diferencia es la
      // materia. Ver `app/libros/libros.html`.
      error: (e: HttpErrorResponse) => {
        this.estado.set(e.status);
        this.cargando.set(false);
      },
    });
  }
}
