import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CategoryPublisher } from './category-publisher.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CategoryPublisherService {

    private resourceUrl = 'api/category-publishers';
    private resourceSearchUrl = 'api/_search/category-publishers';

    constructor(private http: Http) { }

    create(categoryPublisher: CategoryPublisher): Observable<CategoryPublisher> {
        const copy = this.convert(categoryPublisher);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(categoryPublisher: CategoryPublisher): Observable<CategoryPublisher> {
        const copy = this.convert(categoryPublisher);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<CategoryPublisher> {
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

    private convert(categoryPublisher: CategoryPublisher): CategoryPublisher {
        const copy: CategoryPublisher = Object.assign({}, categoryPublisher);
        return copy;
    }
}
