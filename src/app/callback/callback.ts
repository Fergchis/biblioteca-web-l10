import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

@Component({
  selector: 'app-callback',
  imports: [RouterLink],
  templateUrl: './callback.html',
})
export class Callback {
  private readonly router = inject(Router);

  protected readonly conCodigo = signal(
    new URLSearchParams(window.location.search).has('code'),
  );

  constructor() {
    // Amplify avisa por el Hub cuando termina de canjear el codigo
    Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signInWithRedirect') {
        this.router.navigateByUrl('/libros');
      }
    });

    // Y por si el canje ya habia terminado antes de que naciera esta pagina
    this.siYaHaySesion();
  }

  private async siYaHaySesion() {
    const { tokens } = await fetchAuthSession();
    if (tokens?.accessToken) this.router.navigateByUrl('/libros');
  }
}
