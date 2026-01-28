import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { CompanyData } from './services/company-data';
import { firstValueFrom } from 'rxjs';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'invoices/:companyId',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const companyService = inject(CompanyData);
      const ids = await firstValueFrom(companyService.getCompanies());
      return ids.map(c => ({ id: c.id.toString() }));
    },
  },
  {
    path : 'company/:id/clients',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const companyService = inject(CompanyData);
      const ids = await firstValueFrom(companyService.getCompanies());
      return ids.map(c => ({ id: c.id.toString() }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
