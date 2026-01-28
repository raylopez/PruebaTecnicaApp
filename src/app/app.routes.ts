import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((c)=>c.Home)
  },
  {
    path: 'invoices/:companyId',
    loadComponent: () => import('./pages/invoice-generator/invoice-generator').then((c)=>c.InvoiceGenerator)
  },
  {
    path: 'company/:id/clients',
    loadComponent: () => import('./pages/clients/clients').then(c => c.Clients)
  }
];
