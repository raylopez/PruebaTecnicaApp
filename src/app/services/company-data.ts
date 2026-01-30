import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Client, Company } from '@models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyData {
  private readonly http = inject(HttpClient);

  public getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${environment.apiUrl}/api/company`);
  }

  public getCompanyById(id: number): Observable<Company> {
    return this.http.get<Company>(`${environment.apiUrl}/api/company/${id}`);
  }

  public getCompanyByIdWithClients(id: number): Observable<Company> {
    return this.http.get<Company>(`${environment.apiUrl}/api/company/${id}/clients`);
  }

  public getInvoicesClients(id: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.apiUrl}/api/company/${id}/clients/invoices`);
  }
}
