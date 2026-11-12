import { Routes } from '@angular/router';
import { Libros } from './libros/libros';
import { Prestamos } from './prestamos/prestamos';
import { Panel } from './panel/panel';
import { Callback } from './callback/callback';
import { sesionGuard } from './auth/sesion.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'libros', pathMatch: 'full' },
  { path: 'libros',    component: Libros,    canActivate: [sesionGuard] },
  { path: 'prestamos', component: Prestamos, canActivate: [sesionGuard] },
  { path: 'panel',     component: Panel,     canActivate: [sesionGuard] },
  { path: 'callback',  component: Callback },
];
