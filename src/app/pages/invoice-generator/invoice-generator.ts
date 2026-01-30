import { CurrencyPipe, KeyValuePipe } from '@angular/common';
import { Component, computed, inject, input, signal, TemplateRef } from '@angular/core';
import { form, FormField, max, maxLength, min, required } from '@angular/forms/signals';
import { Router } from "@angular/router";
import { ModalAlert } from '@components/modal-alert/modal-alert';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal';
import { ItemTypePipe, NumberPadZeroPipe } from '@pipes';
import { CompanyData, InvoiceData } from '@services';
import { Company, CreateInvoice, CreateInvoiceItem, CreateItem, createItemInital, ItemType } from '@models';

const invoiceFormModel = signal<CreateInvoice>({
  client_id: '',
  due_date: new Date(),
  item_type: '',
  notes: ''
});

const percentagesModel = signal<{ discount: number, tax: number }>({ discount: 0, tax:0 });

@Component({
  selector: 'app-invoice-generator',
  imports: [FormField, KeyValuePipe, ItemTypePipe, NumberPadZeroPipe, CurrencyPipe],
  templateUrl: './invoice-generator.html',
  styleUrl: './invoice-generator.css',
})
export class InvoiceGenerator {
  public companyId = input<number>(0);

  private modalService = inject(NgbModal);
  private readonly companyService = inject(CompanyData);
  private readonly invoiceService = inject(InvoiceData);
  private readonly router = inject(Router);

  public company = signal<Company|null>(null);
  public itemsSignal = signal<CreateItem[]>([]);
  public itemModelSignal = signal<CreateItem>(createItemInital);

  public subtotalSignal = computed(() => {
    return this.itemsSignal().reduce((total, item) => total + item.unit_price * item.quantity, 0)
  });
  public totalSignal = computed(
    () => {

      if(this.invoiceForm.item_type().invalid()) return 0;

      let result = this.subtotalSignal();
      const { item_type } = this.invoiceForm().value();
      const { tax, discount } = this.percentagesForm().value();

      if(item_type == ItemType.Product.toString()) {
        const firstTotal = this.itemsSignal().reduce((sum, item)=> sum + (item.quantity * item.unit_price) ,0);
        const totalTax = firstTotal * (tax / 100);
        const totalWithTax = firstTotal + totalTax;
        const totalDiscount = totalWithTax * (discount / 100);
        const totalFinal = totalWithTax - totalDiscount;

        return totalFinal;
      }

      else if (item_type == ItemType.Service.toString()) {
        const firstTotal = this.itemsSignal().reduce((sum, item)=> sum + (item.quantity * item.unit_price) ,0);
        const resulDiscount = firstTotal * (discount / 100);
        const resultWithDiscount = firstTotal - resulDiscount;
        const resultTax = resultWithDiscount *  (tax / 100);
        const resultFinal = resultWithDiscount + resultTax;

        return resultFinal;
      }

      return result;
    }
  );

  public eItemType = {
    [ItemType.Product] : 'Producto',
    [ItemType.Service] : 'Servicio'
  };

  public selectedItem?: CreateItem|null;
  public invoiceForm = form(invoiceFormModel, (schemaPath) => {
    required(schemaPath.client_id, { message: 'El cliente es requerido' });
    required(schemaPath.due_date, { message: 'La fecha es requerida' });
    required(schemaPath.item_type, { message: 'El tipo de recurso es requerido' });

    maxLength(schemaPath.notes, 120, { message: 'Las notas no pueden tener más de 120 caracteres' })
  });
  public itemForm = form(this.itemModelSignal, (schemaPath) => {
    required(schemaPath.description, { message: 'La descripción es requerida' });

    required(schemaPath.quantity, { message: 'La cantidad es requerida' });
    min(schemaPath.quantity, 1, { message: 'La cantidad debe ser a partir de 1' });
    max(schemaPath.quantity, 100, { message: 'La cantidad debe ser menor a 100' });

    required(schemaPath.unit_price, { message: 'El precio es requerido' });
    min(schemaPath.unit_price, 1, { message: 'El precio debe ser a partir de 1' });
  });
  public percentagesForm = form(percentagesModel);

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData() {
    this.companyService.getCompanyByIdWithClients(this.companyId())
      .subscribe(comp => this.company.set(comp));
  }

  saveInvoice() {
    if (this.invoiceForm().invalid())
      return;

    const { client_id, due_date, notes } = this.invoiceForm().value();
    const { discount, tax } = this.percentagesForm().value();

    const body: CreateInvoiceItem = {
      discount,
      tax,
      client_id: Number(client_id),
      due_date,
      notes,
      subtotal: this.subtotalSignal(),
      total: this.totalSignal(),
      items: this.itemsSignal(),
    }

    this.invoiceService.generateInvoice(body)
      .subscribe({
        next: (resp) => {
          this.openSuccessfullModal();
        },
        error: (err) => {
          this.openModal('Ocurrió un error al generar la factura','Aceptar');
        }
      });
  }

  addItem(modal: NgbModalRef) {
    if(modal)
      modal.close('close');

    if (this.itemForm().invalid() || this.invoiceForm.item_type().invalid()) {
      return;
    }

    const { description, unit_price, quantity } = this.itemForm().value();
    const { item_type } = this.invoiceForm().value();

    let emptyItem: CreateItem = {
      description,
      unit_price,
      quantity,
      type: item_type
    };

    const allSame = this.itemsSignal().every(it => it.type == emptyItem.type);
    if (!allSame) {
      alert('Solo se pueden agregar recursos de un mismo tipo');
      return;
    }

    this.itemsSignal.update(current => [...current, emptyItem]);
    this.itemForm().reset(createItemInital)
  }

  removeItem(item: CreateItem) {
    this.itemsSignal.update(currents => {
      const idx = currents.indexOf(item);
      if (idx > -1) {
        const currentFinal = [...currents];
        currentFinal.splice(idx, 1);
        return currentFinal;
      }

      return currents;
    })
  }

  prepareEdit(item: CreateItem, content: TemplateRef<any>) {
    this.selectedItem = item;
    this.itemForm().reset(this.selectedItem);
    this.openModalWithContent(content);
  }

  editItem(modal: NgbModalRef, item?: CreateItem | null) {
    modal.close('close');
    if(!item) return;

    this.itemsSignal.update(currents => {
      const idx = currents.indexOf(item);
      if (idx > -1) {
        const { description, unit_price, quantity } = this.itemForm().value();

        currents[idx] = {
          description,
          unit_price,
          quantity,
          type: currents[idx].type
        }

        const currentFinal = [...currents];

        return currentFinal;
      }

      return currents;
    })
  }

  openSuccessfullModal() {
    this.openModal('Factura creada con exitosamente', 'Ir a lista de facuras')
      .result.then(
        (result)=> {},
        (reason) => {
          if (reason === 'okAction') {
            this.router.navigate(['/company', this.companyId() ,'clients']);
          }
        }
      );
  }

  openModal(message: string, okText: string) {
    const modalRef = this.modalService.open(ModalAlert);
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.okButtonText = okText;
    return modalRef;
  }

  openModalWithContent(content: TemplateRef<any>) {
    this.modalService.open(content).result.then(
      (result) => {},
      (reason) => {
        this.selectedItem = null;
        this.itemForm().reset(createItemInital);
      }
    );
  }
}
