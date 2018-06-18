import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { CategoryNode } from './category-node.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<CategoryNode>;

@Injectable()
export class CategoryNodeService {

    private resourceUrl =  SERVER_API_URL + 'api/category-nodes';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-nodes';

    constructor(private http: HttpClient) { }

    create(categoryNode: CategoryNode): Observable<EntityResponseType> {
        const copy = this.convert(categoryNode);
        return this.http.post<CategoryNode>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(categoryNode: CategoryNode): Observable<EntityResponseType> {
        const copy = this.convert(categoryNode);
        return this.http.put<CategoryNode>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<CategoryNode>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<CategoryNode[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategoryNode[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategoryNode[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<CategoryNode[]>> {
        const options = createRequestOption(req);
        return this.http.get<CategoryNode[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<CategoryNode[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: CategoryNode = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<CategoryNode[]>): HttpResponse<CategoryNode[]> {
        const jsonResponse: CategoryNode[] = res.body;
        const body: CategoryNode[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to CategoryNode.
     */
    private convertItemFromServer(categoryNode: CategoryNode): CategoryNode {
        const copy: CategoryNode = Object.assign({}, categoryNode);
        return copy;
    }

    /**
     * Convert a CategoryNode to a JSON which can be sent to the server.
     */
    private convert(categoryNode: CategoryNode): CategoryNode {
        const copy: CategoryNode = Object.assign({}, categoryNode);
        return copy;
    }
}
