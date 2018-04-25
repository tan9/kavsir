import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { CategoryGrade } from './category-grade.model';
import { createRequestOption } from '../../shared';
import { CategoryService } from '../category.service';

export type EntityResponseType = HttpResponse<CategoryGrade>;

@Injectable()
export class CategoryGradeService implements CategoryService<CategoryGrade> {

    private resourceUrl =  SERVER_API_URL + 'api/category-grades';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-grades';

    constructor(private http: HttpClient) { }

    create(categoryGrade: CategoryGrade): Observable<EntityResponseType> {
        const copy = this.convert(categoryGrade);
        return this.http.post<CategoryGrade>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(categoryGrade: CategoryGrade): Observable<EntityResponseType> {
        const copy = this.convert(categoryGrade);
        return this.http.put<CategoryGrade>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CategoryGrade>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CategoryGrade[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategoryGrade[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategoryGrade[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CategoryGrade[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategoryGrade[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategoryGrade[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CategoryGrade = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CategoryGrade[]>): HttpResponse<CategoryGrade[]> {
        const jsonResponse: CategoryGrade[] = res.body;
        const body: CategoryGrade[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CategoryGrade.
     */
    private convertItemFromServer(categoryGrade: CategoryGrade): CategoryGrade {
        const copy: CategoryGrade = Object.assign({}, categoryGrade);
        return copy;
    }

    /**
     * Convert a CategoryGrade to a JSON which can be sent to the server.
     */
    private convert(categoryGrade: CategoryGrade): CategoryGrade {
        const copy: CategoryGrade = Object.assign({}, categoryGrade);
        return copy;
    }
}
