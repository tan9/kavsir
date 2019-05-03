export interface ICategorySubject {
  id?: number;
  position?: number;
  name?: string;
}

export class CategorySubject implements ICategorySubject {
  constructor(public id?: number, public position?: number, public name?: string) {}
}
