import { BaseEntity } from './../../shared';

export class CategoryPublisher implements BaseEntity {
    constructor(
        public id?: number,
        public position?: number,
        public name?: string,
    ) {
    }
}
