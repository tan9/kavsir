import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { CategoryNode } from './category-node.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class CategoryNodeService {

    private resourceUrl = 'api/category-nodes';
    private resourceSearchUrl = 'api/_search/category-nodes';

    constructor(private http: Http) { }

    create(categoryNode: CategoryNode): Observable<CategoryNode> {
        const copy = this.convert(categoryNode);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(categoryNode: CategoryNode): Observable<CategoryNode> {
        const copy = this.convert(categoryNode);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<CategoryNode> {
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

    private convert(categoryNode: CategoryNode): CategoryNode {
        const copy: CategoryNode = Object.assign({}, categoryNode);
        return copy;
    }
}
