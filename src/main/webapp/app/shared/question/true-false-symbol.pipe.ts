import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'trueFalseSymbol'})
export class TrueFalseSymbolPipe implements PipeTransform {

    transform(value: boolean): string {
        return value ? '◯' : '╳';
    }
}
