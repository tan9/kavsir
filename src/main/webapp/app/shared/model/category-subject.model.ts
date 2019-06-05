import { Category } from 'app/entities/category.model';

export interface ICategorySubject {
  id?: number;
  position?: number;
  name?: string;
}

export class CategorySubject extends Category implements ICategorySubject {
  constructor(public id?: number, public position?: number, public name?: string) {
    super(id, position, name);
  }
}
