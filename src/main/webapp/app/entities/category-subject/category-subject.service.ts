import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { CategorySubject } from './category-subject.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<CategorySubject>;

@Injectable()
export class CategorySubjectService {

    private resourceUrl =  SERVER_API_URL + 'api/category-subjects';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-subjects';

    constructor(private http: HttpClient) { }

    create(categorySubject: CategorySubject): Observable<EntityResponseType> {
        const copy = this.convert(categorySubject);
        return this.http.post<CategorySubject>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(categorySubject: CategorySubject): Observable<EntityResponseType> {
        const copy = this.convert(categorySubject);
        return this.http.put<CategorySubject>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CategorySubject>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CategorySubject[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategorySubject[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategorySubject[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CategorySubject[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategorySubject[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategorySubject[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CategorySubject = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CategorySubject[]>): HttpResponse<CategorySubject[]> {
        const jsonResponse: CategorySubject[] = res.body;
        const body: CategorySubject[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CategorySubject.
     */
    private convertItemFromServer(categorySubject: CategorySubject): CategorySubject {
        const copy: CategorySubject = Object.assign({}, categorySubject);
        return copy;
    }

    /**
     * Convert a CategorySubject to a JSON which can be sent to the server.
     */
    private convert(categorySubject: CategorySubject): CategorySubject {
        const copy: CategorySubject = Object.assign({}, categorySubject);
        return copy;
    }
}
