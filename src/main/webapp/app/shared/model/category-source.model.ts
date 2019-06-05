import { Category } from 'app/entities/category.model';

export interface ICategorySource {
  id?: number;
  position?: number;
  name?: string;
}

export class CategorySource extends Category implements ICategorySource {
  constructor(public id?: number, public position?: number, public name?: string) {
    super(id, position, name);
  }
}
