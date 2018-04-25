import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { CategorySource } from './category-source.model';
import { createRequestOption } from '../../shared';
import { CategoryService } from '../category.service';

export type EntityResponseType = HttpResponse<CategorySource>;

@Injectable()
export class CategorySourceService implements CategoryService<CategorySource> {

    private resourceUrl =  SERVER_API_URL + 'api/category-sources';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-sources';

    constructor(private http: HttpClient) { }

    create(categorySource: CategorySource): Observable<EntityResponseType> {
        const copy = this.convert(categorySource);
        return this.http.post<CategorySource>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(categorySource: CategorySource): Observable<EntityResponseType> {
        const copy = this.convert(categorySource);
        return this.http.put<CategorySource>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CategorySource>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CategorySource[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategorySource[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategorySource[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CategorySource[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategorySource[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategorySource[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CategorySource = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CategorySource[]>): HttpResponse<CategorySource[]> {
        const jsonResponse: CategorySource[] = res.body;
        const body: CategorySource[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CategorySource.
     */
    private convertItemFromServer(categorySource: CategorySource): CategorySource {
        const copy: CategorySource = Object.assign({}, categorySource);
        return copy;
    }

    /**
     * Convert a CategorySource to a JSON which can be sent to the server.
     */
    private convert(categorySource: CategorySource): CategorySource {
        const copy: CategorySource = Object.assign({}, categorySource);
        return copy;
    }
}
