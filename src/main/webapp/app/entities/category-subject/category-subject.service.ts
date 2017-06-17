import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CategorySubject } from './category-subject.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { CategoryService } from '../category.service';

@Injectable()
export class CategorySubjectService implements CategoryService<CategorySubject> {

    private resourceUrl = 'api/category-subjects';
    private resourceSearchUrl = 'api/_search/category-subjects';

    constructor(private http: Http) { }

    create(categorySubject: CategorySubject): Observable<CategorySubject> {
        const copy = this.convert(categorySubject);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(categorySubject: CategorySubject): Observable<CategorySubject> {
        const copy = this.convert(categorySubject);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<CategorySubject> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(categorySubject: CategorySubject): CategorySubject {
        const copy: CategorySubject = Object.assign({}, categorySubject);
        return copy;
    }
}
