import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addressFormatter',
  standalone: true
})
export class AddressFormatterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    let formatted = value.trim().replace(/\s+/g, ' ');

    formatted = formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return formatted;
  }
}