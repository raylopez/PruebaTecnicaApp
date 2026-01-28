import { Pipe, PipeTransform } from '@angular/core';
import { ItemType } from '../models/invoice';

@Pipe({
  name: 'itemType',
})
export class ItemTypePipe implements PipeTransform {

  transform(value: string): string {
    const found = ItemType;
    switch (true) {
      case (found.Product.toString() === value):
        return 'Producto';
      case (found.Service.toString() === value):
        return 'Servicio';
      default:
        return '';
    }
  }

}
