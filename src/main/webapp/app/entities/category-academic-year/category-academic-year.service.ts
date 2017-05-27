import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CategoryAcademicYear } from './category-academic-year.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CategoryAcademicYearService {

    private resourceUrl = 'api/category-academic-years';
    private resourceSearchUrl = 'api/_search/category-academic-years';

    constructor(private http: Http) { }

    create(categoryAcademicYear: CategoryAcademicYear): Observable<CategoryAcademicYear> {
        const copy = this.convert(categoryAcademicYear);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(categoryAcademicYear: CategoryAcademicYear): Observable<CategoryAcademicYear> {
        const copy = this.convert(categoryAcademicYear);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<CategoryAcademicYear> {
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
        return new ResponseWrapper(res.headers, jsonResponse);
    }

    private convert(categoryAcademicYear: CategoryAcademicYear): CategoryAcademicYear {
        const copy: CategoryAcademicYear = Object.assign({}, categoryAcademicYear);
        return copy;
    }
}