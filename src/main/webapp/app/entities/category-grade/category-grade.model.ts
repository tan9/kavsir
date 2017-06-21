import { BaseEntity } from './../../shared';

export class CategoryGrade implements BaseEntity {
    constructor(
        public id?: number,
        public position?: number,
        public name?: string,
    ) {
    }
}
