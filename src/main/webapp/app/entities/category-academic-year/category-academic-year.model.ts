import { BaseEntity } from './../../shared';

export class CategoryAcademicYear implements BaseEntity {
    constructor(
        public id?: number,
        public position?: number,
        public name?: string,
    ) {
    }
}
