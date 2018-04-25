import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { ResourceImage } from './resource-image.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<ResourceImage>;

@Injectable()
export class ResourceImageService {

    private resourceUrl =  SERVER_API_URL + 'api/resource-images';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/resource-images';

    constructor(private http: HttpClient) { }

    create(resourceImage: ResourceImage): Observable<EntityResponseType> {
        const copy = this.convert(resourceImage);
        return this.http.post<ResourceImage>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(resourceImage: ResourceImage): Observable<EntityResponseType> {
        const copy = this.convert(resourceImage);
        return this.http.put<ResourceImage>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ResourceImage>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<ResourceImage[]>> {
        const options = createRequestOption(req);
        return this.http.get<ResourceImage[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ResourceImage[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<ResourceImage[]>> {
        const options = createRequestOption(req);
        return this.http.get<ResourceImage[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<ResourceImage[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ResourceImage = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ResourceImage[]>): HttpResponse<ResourceImage[]> {
        const jsonResponse: ResourceImage[] = res.body;
        const body: ResourceImage[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ResourceImage.
     */
    private convertItemFromServer(resourceImage: ResourceImage): ResourceImage {
        const copy: ResourceImage = Object.assign({}, resourceImage);
        return copy;
    }

    /**
     * Convert a ResourceImage to a JSON which can be sent to the server.
     */
    private convert(resourceImage: ResourceImage): ResourceImage {
        const copy: ResourceImage = Object.assign({}, resourceImage);
        return copy;
    }
}
