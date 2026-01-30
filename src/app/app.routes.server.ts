import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { CompanyData } from '@services';
import { firstValueFrom } from 'rxjs';

const preRenderCompanyIds = async (idKey: string = 'id'): Promise<Record<string, string>[]> => {
  const companyService = inject(CompanyData);
  const ids = await firstValueFrom(companyService.getCompanies());

  if (!ids)
    return [];

  return ids.map(c => ({  [idKey] : c.id.toString() }));
}

export const serverRoutes: ServerRoute[] = [
  {
    path: 'invoices/:companyId',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => preRenderCompanyIds('companyId')
  },
  {
    path : 'company/:id/clients',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: preRenderCompanyIds
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
