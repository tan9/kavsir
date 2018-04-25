import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { QuestionGroup } from './question-group.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<QuestionGroup>;

@Injectable()
export class QuestionGroupService {

    private resourceUrl =  SERVER_API_URL + 'api/question-groups';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/question-groups';

    constructor(private http: HttpClient) { }

    create(questionGroup: QuestionGroup): Observable<EntityResponseType> {
        const copy = this.convert(questionGroup);
        return this.http.post<QuestionGroup>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(questionGroup: QuestionGroup): Observable<EntityResponseType> {
        const copy = this.convert(questionGroup);
        return this.http.put<QuestionGroup>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<QuestionGroup>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<QuestionGroup[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionGroup[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionGroup[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<QuestionGroup[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionGroup[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionGroup[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: QuestionGroup = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<QuestionGroup[]>): HttpResponse<QuestionGroup[]> {
        const jsonResponse: QuestionGroup[] = res.body;
        const body: QuestionGroup[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to QuestionGroup.
     */
    private convertItemFromServer(questionGroup: QuestionGroup): QuestionGroup {
        const copy: QuestionGroup = Object.assign({}, questionGroup);
        return copy;
    }

    /**
     * Convert a QuestionGroup to a JSON which can be sent to the server.
     */
    private convert(questionGroup: QuestionGroup): QuestionGroup {
        const copy: QuestionGroup = Object.assign({}, questionGroup);
        return copy;
    }
}
