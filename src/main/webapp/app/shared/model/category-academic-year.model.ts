import { Category } from 'app/entities/category.model';

export interface ICategoryAcademicYear {
  id?: number;
  position?: number;
  name?: string;
}

export class CategoryAcademicYear extends Category implements ICategoryAcademicYear {
  constructor(public id?: number, public position?: number, public name?: string) {
    super(id, position, name);
  }
}
