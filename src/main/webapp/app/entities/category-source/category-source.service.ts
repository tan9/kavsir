import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { CategorySource } from './category-source.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { CategoryService } from '../category.service';

@Injectable()
export class CategorySourceService implements CategoryService<CategorySource> {

    private resourceUrl = SERVER_API_URL + 'api/category-sources';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-sources';

    constructor(private http: Http) { }

    create(categorySource: CategorySource): Observable<CategorySource> {
        const copy = this.convert(categorySource);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(categorySource: CategorySource): Observable<CategorySource> {
        const copy = this.convert(categorySource);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<CategorySource> {
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

    private convert(categorySource: CategorySource): CategorySource {
        const copy: CategorySource = Object.assign({}, categorySource);
        return copy;
    }
}
