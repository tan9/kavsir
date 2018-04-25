import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { QuestionChoice } from './question-choice.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<QuestionChoice>;

@Injectable()
export class QuestionChoiceService {

    private resourceUrl =  SERVER_API_URL + 'api/question-choices';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/question-choices';

    constructor(private http: HttpClient) { }

    create(questionChoice: QuestionChoice): Observable<EntityResponseType> {
        const copy = this.convert(questionChoice);
        return this.http.post<QuestionChoice>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(questionChoice: QuestionChoice): Observable<EntityResponseType> {
        const copy = this.convert(questionChoice);
        return this.http.put<QuestionChoice>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<QuestionChoice>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<QuestionChoice[]>> {
        const options = createRequestOption(req);
        if (req && req.categories) {
            options.append('categories', req.categories);
        }
        if (req && req.hasOwnProperty('multi')) {
            options.append('multi', req.multi);
        }
        return this.http.get<QuestionChoice[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionChoice[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<QuestionChoice[]>> {
        const options = createRequestOption(req);
        if (req && req.categories) {
            options.append('categories', req.categories);
        }
        if (req && req.hasOwnProperty('multi')) {
            options.append('multi', req.multi);
        }
        return this.http.get<QuestionChoice[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionChoice[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: QuestionChoice = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<QuestionChoice[]>): HttpResponse<QuestionChoice[]> {
        const jsonResponse: QuestionChoice[] = res.body;
        const body: QuestionChoice[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to QuestionChoice.
     */
    private convertItemFromServer(questionChoice: QuestionChoice): QuestionChoice {
        const copy: QuestionChoice = Object.assign({}, questionChoice);
        return copy;
    }

    /**
     * Convert a QuestionChoice to a JSON which can be sent to the server.
     */
    private convert(questionChoice: QuestionChoice): QuestionChoice {
        const copy: QuestionChoice = Object.assign({}, questionChoice);
        return copy;
    }
}
