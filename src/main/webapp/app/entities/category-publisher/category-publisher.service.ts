import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { CategoryPublisher } from './category-publisher.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CategoryPublisherService {

    private resourceUrl = SERVER_API_URL + 'api/category-publishers';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-publishers';

    constructor(private http: Http) { }

    create(categoryPublisher: CategoryPublisher): Observable<CategoryPublisher> {
        const copy = this.convert(categoryPublisher);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(categoryPublisher: CategoryPublisher): Observable<CategoryPublisher> {
        const copy = this.convert(categoryPublisher);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<CategoryPublisher> {
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
     * Convert a returned JSON object to CategoryPublisher.
     */
    private convertItemFromServer(json: any): CategoryPublisher {
        const entity: CategoryPublisher = Object.assign(new CategoryPublisher(), json);
        return entity;
    }

    /**
     * Convert a CategoryPublisher to a JSON which can be sent to the server.
     */
    private convert(categoryPublisher: CategoryPublisher): CategoryPublisher {
        const copy: CategoryPublisher = Object.assign({}, categoryPublisher);
        return copy;
    }
}
