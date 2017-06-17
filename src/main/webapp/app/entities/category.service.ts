import { Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ResponseWrapper } from '../shared';
import { Category } from "./category.model";

export interface CategoryService<T extends Category> {

    create(category: T): Observable<T>;

    update(category: T): Observable<T>;

    find(id: number): Observable<T>;

    query(req?: any): Observable<ResponseWrapper>;

    delete(id: number): Observable<Response>;

}
