import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, of, switchMap, timer } from 'rxjs';
import { Biblioteca, PanelEnVivo } from '../biblioteca';

const CADA_MS = 5000;

/**
 * El panel en vivo de la maraton de lectura (L10). Pide GET /v1/panel/en-vivo al gateway cada 5 segundos.
 * Con el simulador a --velocidad 60, cada refresco avanza unos cinco minutos de la noche.
 *
 * Solo para bibliotecarios: el BFF responde 403 a cualquier otro, y aca se muestra ese 403 tal cual.
 */
@Component({
  selector: 'app-panel',
  templateUrl: './panel.html',
})
export class Panel {
  private readonly biblioteca = inject(Biblioteca);

  protected readonly datos = signal<PanelEnVivo | null>(null);
  protected readonly estado = signal<number | null>(null);
  protected readonly refrescos = signal(0);

  constructor() {
    timer(0, CADA_MS)
      .pipe(
        // switchMap: si una respuesta tarda mas de 5 s, se descarta y vale la siguiente.
        switchMap(() =>
          this.biblioteca.panelEnVivo().pipe(
            catchError((e: HttpErrorResponse) => {
              this.estado.set(e.status);
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((datos) => {
        this.refrescos.update((n) => n + 1);
        if (datos) {
          this.datos.set(datos);
          this.estado.set(200);
        }
      });
  }

  // Los ultimos 10 minutos, el mas reciente arriba.
  protected ultimosMinutos() {
    return (this.datos()?.porMinuto ?? []).slice(-10).reverse();
  }

  protected librosConMasLecturas() {
    return (this.datos()?.porLibro ?? []).slice(0, 8);
  }
}
