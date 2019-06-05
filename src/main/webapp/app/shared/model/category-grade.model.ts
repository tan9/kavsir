import { Category } from 'app/entities/category.model';

export interface ICategoryGrade {
  id?: number;
  position?: number;
  name?: string;
}

export class CategoryGrade extends Category implements ICategoryGrade {
  constructor(public id?: number, public position?: number, public name?: string) {
    super(id, position, name);
  }
}
