import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { CategoryAcademicYear } from './category-academic-year.model';
import { createRequestOption } from '../../shared';
import { CategoryService } from '../category.service';

export type EntityResponseType = HttpResponse<CategoryAcademicYear>;

@Injectable()
export class CategoryAcademicYearService implements CategoryService<CategoryAcademicYear> {

    private resourceUrl =  SERVER_API_URL + 'api/category-academic-years';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-academic-years';

    constructor(private http: HttpClient) { }

    create(categoryAcademicYear: CategoryAcademicYear): Observable<EntityResponseType> {
        const copy = this.convert(categoryAcademicYear);
        return this.http.post<CategoryAcademicYear>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(categoryAcademicYear: CategoryAcademicYear): Observable<EntityResponseType> {
        const copy = this.convert(categoryAcademicYear);
        return this.http.put<CategoryAcademicYear>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CategoryAcademicYear>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CategoryAcademicYear[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategoryAcademicYear[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategoryAcademicYear[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CategoryAcademicYear[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategoryAcademicYear[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategoryAcademicYear[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CategoryAcademicYear = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CategoryAcademicYear[]>): HttpResponse<CategoryAcademicYear[]> {
        const jsonResponse: CategoryAcademicYear[] = res.body;
        const body: CategoryAcademicYear[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CategoryAcademicYear.
     */
    private convertItemFromServer(categoryAcademicYear: CategoryAcademicYear): CategoryAcademicYear {
        const copy: CategoryAcademicYear = Object.assign({}, categoryAcademicYear);
        return copy;
    }

    /**
     * Convert a CategoryAcademicYear to a JSON which can be sent to the server.
     */
    private convert(categoryAcademicYear: CategoryAcademicYear): CategoryAcademicYear {
        const copy: CategoryAcademicYear = Object.assign({}, categoryAcademicYear);
        return copy;
    }
}
