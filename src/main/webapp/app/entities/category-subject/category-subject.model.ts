import { BaseEntity } from './../../shared';

export class CategorySubject implements BaseEntity {
    constructor(
        public id?: number,
        public position?: number,
        public name?: string,
    ) {
    }
}
