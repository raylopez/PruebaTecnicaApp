import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberPadZero',
})
export class NumberPadZeroPipe implements PipeTransform {

  transform(value: number, maxLegthPad: number = 2): string {
    return String(value).padStart(maxLegthPad,'0');
  }

}
