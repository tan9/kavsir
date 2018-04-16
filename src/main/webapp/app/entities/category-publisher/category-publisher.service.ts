import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { CategoryPublisher } from './category-publisher.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<CategoryPublisher>;

@Injectable()
export class CategoryPublisherService {

    private resourceUrl =  SERVER_API_URL + 'api/category-publishers';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-publishers';

    constructor(private http: HttpClient) { }

    create(categoryPublisher: CategoryPublisher): Observable<EntityResponseType> {
        const copy = this.convert(categoryPublisher);
        return this.http.post<CategoryPublisher>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(categoryPublisher: CategoryPublisher): Observable<EntityResponseType> {
        const copy = this.convert(categoryPublisher);
        return this.http.put<CategoryPublisher>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CategoryPublisher>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CategoryPublisher[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategoryPublisher[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategoryPublisher[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CategoryPublisher[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategoryPublisher[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategoryPublisher[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CategoryPublisher = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CategoryPublisher[]>): HttpResponse<CategoryPublisher[]> {
        const jsonResponse: CategoryPublisher[] = res.body;
        const body: CategoryPublisher[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CategoryPublisher.
     */
    private convertItemFromServer(categoryPublisher: CategoryPublisher): CategoryPublisher {
        const copy: CategoryPublisher = Object.assign({}, categoryPublisher);
        return copy;
    }

    /**
     * Convert a CategoryPublisher to a JSON which can be sent to the server.
     */
    private convert(categoryPublisher: CategoryPublisher): CategoryPublisher {
        const copy: CategoryPublisher = Object.assign({}, categoryPublisher);
        return copy;
    }
}
