import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CreateInvoiceItem } from '../models/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceData {
  private readonly http = inject(HttpClient);

  public downloadInvoicePdf(invoiceId: number) {
    return this.http.get(`${environment.apiUrl}/api/invoice/${invoiceId}/pdf`, { observe: 'response', responseType: 'blob' });
  }

  public generateInvoice(invoiceRequest : CreateInvoiceItem) {
    return this.http.post(`${environment.apiUrl}/api/invoice/generate-head`, invoiceRequest);
  }
}
