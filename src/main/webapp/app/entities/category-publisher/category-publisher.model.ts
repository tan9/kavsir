import { Category } from '../category.model';

export class CategoryPublisher extends Category {
    constructor(
        public id?: number,
        public position?: number,
        public name?: string,
    ) {
        super(id, position, name);
    }
}
