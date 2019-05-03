export interface ICategorySource {
  id?: number;
  position?: number;
  name?: string;
}

export class CategorySource implements ICategorySource {
  constructor(public id?: number, public position?: number, public name?: string) {}
}
