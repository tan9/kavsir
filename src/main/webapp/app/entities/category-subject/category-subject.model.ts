import { BaseEntity } from './../../shared';
import { Category } from '../category.model';

export class CategorySubject extends Category implements BaseEntity {
    constructor(
        public id?: number,
        public position?: number,
        public name?: string,
    ) {
        super(id, position, name);
    }
}
