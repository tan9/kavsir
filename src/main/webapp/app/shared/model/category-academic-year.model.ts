export interface ICategoryAcademicYear {
  id?: number;
  position?: number;
  name?: string;
}

export class CategoryAcademicYear implements ICategoryAcademicYear {
  constructor(public id?: number, public position?: number, public name?: string) {}
}
