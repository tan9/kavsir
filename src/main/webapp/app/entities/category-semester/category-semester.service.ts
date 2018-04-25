import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { CategorySemester } from './category-semester.model';
import { createRequestOption } from '../../shared';
import { CategoryService } from '../category.service';

export type EntityResponseType = HttpResponse<CategorySemester>;

@Injectable()
export class CategorySemesterService implements CategoryService<CategorySemester> {

    private resourceUrl =  SERVER_API_URL + 'api/category-semesters';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-semesters';

    constructor(private http: HttpClient) { }

    create(categorySemester: CategorySemester): Observable<EntityResponseType> {
        const copy = this.convert(categorySemester);
        return this.http.post<CategorySemester>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(categorySemester: CategorySemester): Observable<EntityResponseType> {
        const copy = this.convert(categorySemester);
        return this.http.put<CategorySemester>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CategorySemester>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CategorySemester[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategorySemester[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategorySemester[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CategorySemester[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategorySemester[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategorySemester[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CategorySemester = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CategorySemester[]>): HttpResponse<CategorySemester[]> {
        const jsonResponse: CategorySemester[] = res.body;
        const body: CategorySemester[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CategorySemester.
     */
    private convertItemFromServer(categorySemester: CategorySemester): CategorySemester {
        const copy: CategorySemester = Object.assign({}, categorySemester);
        return copy;
    }

    /**
     * Convert a CategorySemester to a JSON which can be sent to the server.
     */
    private convert(categorySemester: CategorySemester): CategorySemester {
        const copy: CategorySemester = Object.assign({}, categorySemester);
        return copy;
    }
}
