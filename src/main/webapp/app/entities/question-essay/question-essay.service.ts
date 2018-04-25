import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { QuestionEssay } from './question-essay.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<QuestionEssay>;

@Injectable()
export class QuestionEssayService {

    private resourceUrl =  SERVER_API_URL + 'api/question-essays';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/question-essays';

    constructor(private http: HttpClient) { }

    create(questionEssay: QuestionEssay): Observable<EntityResponseType> {
        const copy = this.convert(questionEssay);
        return this.http.post<QuestionEssay>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(questionEssay: QuestionEssay): Observable<EntityResponseType> {
        const copy = this.convert(questionEssay);
        return this.http.put<QuestionEssay>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<QuestionEssay>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<QuestionEssay[]>> {
        const options = createRequestOption(req);
        if (req && req.categories) {
            options.append('categories', req.categories);
        }
        return this.http.get<QuestionEssay[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionEssay[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<QuestionEssay[]>> {
        const options = createRequestOption(req);
        if (req && req.categories) {
            options.append('categories', req.categories);
        }
        return this.http.get<QuestionEssay[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionEssay[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: QuestionEssay = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<QuestionEssay[]>): HttpResponse<QuestionEssay[]> {
        const jsonResponse: QuestionEssay[] = res.body;
        const body: QuestionEssay[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to QuestionEssay.
     */
    private convertItemFromServer(questionEssay: QuestionEssay): QuestionEssay {
        const copy: QuestionEssay = Object.assign({}, questionEssay);
        return copy;
    }

    /**
     * Convert a QuestionEssay to a JSON which can be sent to the server.
     */
    private convert(questionEssay: QuestionEssay): QuestionEssay {
        const copy: QuestionEssay = Object.assign({}, questionEssay);
        return copy;
    }
}
