import { Component, DOCUMENT, inject, input, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NumberPadZeroPipe } from '@pipes';
import { CompanyData, InvoiceData } from '@services';
import { Client, Company } from '@models';

@Component({
  selector: 'app-clients',
  imports: [NumberPadZeroPipe, DatePipe, CurrencyPipe],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients {
  public readonly id = input<number>(0);
  private readonly companyService = inject(CompanyData);
  private readonly invoiceService = inject(InvoiceData);
  public company = signal<Company | null>(null);
  public clients = signal<Client[]>([]);
  public document = inject(DOCUMENT);

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData() {
    this.companyService.getCompanyById(this.id())
      .subscribe(com => this.company.set(com) );

    this.companyService.getInvoicesClients(this.id())
      .subscribe(cl => this.clients.set(cl));
  }

  public downloadInvoice(invoiceId: number) {
    this.invoiceService.downloadInvoicePdf(invoiceId)
      .subscribe(res => {
        let blob: Blob = res.body as Blob;
        let a = document.createElement('a');
        a.download = 'invoice.pdf';
        a.href= window.URL.createObjectURL(blob);
        a.click();

      });
  }
}
