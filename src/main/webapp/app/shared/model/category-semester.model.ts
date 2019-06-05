import { Category } from 'app/entities/category.model';

export interface ICategorySemester {
  id?: number;
  position?: number;
  name?: string;
}

export class CategorySemester extends Category implements ICategorySemester {
  constructor(public id?: number, public position?: number, public name?: string) {
    super(id, position, name);
  }
}
