import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, searchKeys: string[]): any[] {
    if (!items || !searchTerm || !searchKeys) {
      return items; // Return the original array if any of the required parameters is missing
    }

    searchTerm = searchTerm.toLowerCase(); // Convert search term to lowercase for case-insensitive matching

    return items.filter(item => {
      return searchKeys.some(key => {
        const value = item[key];
        return value && value.toLowerCase().includes(searchTerm);
      });
    });
  }
}
