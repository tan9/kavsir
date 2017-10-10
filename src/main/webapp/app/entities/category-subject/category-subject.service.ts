import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { CategorySubject } from './category-subject.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { CategoryService } from '../category.service';

@Injectable()
export class CategorySubjectService implements CategoryService<CategorySubject> {

    private resourceUrl = SERVER_API_URL + 'api/category-subjects';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-subjects';

    constructor(private http: Http) { }

    create(categorySubject: CategorySubject): Observable<CategorySubject> {
        const copy = this.convert(categorySubject);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(categorySubject: CategorySubject): Observable<CategorySubject> {
        const copy = this.convert(categorySubject);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<CategorySubject> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
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
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to CategorySubject.
     */
    private convertItemFromServer(json: any): CategorySubject {
        const entity: CategorySubject = Object.assign(new CategorySubject(), json);
        return entity;
    }

    /**
     * Convert a CategorySubject to a JSON which can be sent to the server.
     */
    private convert(categorySubject: CategorySubject): CategorySubject {
        const copy: CategorySubject = Object.assign({}, categorySubject);
        return copy;
    }
}
