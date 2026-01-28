import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path : 'invoices/:companyId',
    renderMode: RenderMode.Client
  },
  {
    path : 'company/:id/clients',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
