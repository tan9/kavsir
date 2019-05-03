export interface ICategorySemester {
  id?: number;
  position?: number;
  name?: string;
}

export class CategorySemester implements ICategorySemester {
  constructor(public id?: number, public position?: number, public name?: string) {}
}
