import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { QuestionTrueFalse } from './question-true-false.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<QuestionTrueFalse>;

@Injectable()
export class QuestionTrueFalseService {

    private resourceUrl =  SERVER_API_URL + 'api/question-true-falses';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/question-true-falses';

    constructor(private http: HttpClient) { }

    create(questionTrueFalse: QuestionTrueFalse): Observable<EntityResponseType> {
        const copy = this.convert(questionTrueFalse);
        return this.http.post<QuestionTrueFalse>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(questionTrueFalse: QuestionTrueFalse): Observable<EntityResponseType> {
        const copy = this.convert(questionTrueFalse);
        return this.http.put<QuestionTrueFalse>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<QuestionTrueFalse>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<QuestionTrueFalse[]>> {
        const options = createRequestOption(req);
        if (req && req.categories) {
            options.append('categories', req.categories);
        }
        return this.http.get<QuestionTrueFalse[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionTrueFalse[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<QuestionTrueFalse[]>> {
        const options = createRequestOption(req);
        if (req && req.categories) {
            options.append('categories', req.categories);
        }
        return this.http.get<QuestionTrueFalse[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionTrueFalse[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: QuestionTrueFalse = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<QuestionTrueFalse[]>): HttpResponse<QuestionTrueFalse[]> {
        const jsonResponse: QuestionTrueFalse[] = res.body;
        const body: QuestionTrueFalse[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to QuestionTrueFalse.
     */
    private convertItemFromServer(questionTrueFalse: QuestionTrueFalse): QuestionTrueFalse {
        const copy: QuestionTrueFalse = Object.assign({}, questionTrueFalse);
        return copy;
    }

    /**
     * Convert a QuestionTrueFalse to a JSON which can be sent to the server.
     */
    private convert(questionTrueFalse: QuestionTrueFalse): QuestionTrueFalse {
        const copy: QuestionTrueFalse = Object.assign({}, questionTrueFalse);
        return copy;
    }
}
