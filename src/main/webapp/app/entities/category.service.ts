import { HttpResponse } from '@angular/common/http/src/response';
import { Observable } from 'rxjs/Rx';

import { Category } from "./category.model";

export interface CategoryService<T extends Category> {

    create(category: T): Observable<HttpResponse<T>>;

    update(category: T): Observable<HttpResponse<T>>;

    find(id: number): Observable<HttpResponse<T>>;

    query(req?: any): Observable<HttpResponse<T[]>>;

    delete(id: number): Observable<HttpResponse<any>>;

}
