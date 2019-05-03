export interface ICategoryGrade {
  id?: number;
  position?: number;
  name?: string;
}

export class CategoryGrade implements ICategoryGrade {
  constructor(public id?: number, public position?: number, public name?: string) {}
}
