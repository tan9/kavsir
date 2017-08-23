import { BaseEntity } from './../../shared';

export class CategorySource implements BaseEntity {
    constructor(
        public id?: number,
        public position?: number,
        public name?: string,
    ) {
    }
}
