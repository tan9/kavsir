import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { QuestionChoiceOption } from './question-choice-option.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<QuestionChoiceOption>;

@Injectable()
export class QuestionChoiceOptionService {

    private resourceUrl =  SERVER_API_URL + 'api/question-choice-options';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/question-choice-options';

    constructor(private http: HttpClient) { }

    create(questionChoiceOption: QuestionChoiceOption): Observable<EntityResponseType> {
        const copy = this.convert(questionChoiceOption);
        return this.http.post<QuestionChoiceOption>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    update(questionChoiceOption: QuestionChoiceOption): Observable<EntityResponseType> {
        const copy = this.convert(questionChoiceOption);
        return this.http.put<QuestionChoiceOption>(this.resourceUrl, copy, { observe: 'response' })
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<QuestionChoiceOption>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<QuestionChoiceOption[]>> {
        const options = createRequestOption(req);
        if (req && req.questionChoiceId) {
            options.append('questionChoiceId', req.questionChoiceId);
        }
        return this.http.get<QuestionChoiceOption[]>(this.resourceUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionChoiceOption[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }

    search(req?: any): Observable<HttpResponse<QuestionChoiceOption[]>> {
        const options = createRequestOption(req);
        return this.http.get<QuestionChoiceOption[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
            .map((res: HttpResponse<QuestionChoiceOption[]>) => this.convertArrayResponse(res));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: QuestionChoiceOption = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<QuestionChoiceOption[]>): HttpResponse<QuestionChoiceOption[]> {
        const jsonResponse: QuestionChoiceOption[] = res.body;
        const body: QuestionChoiceOption[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to QuestionChoiceOption.
     */
    private convertItemFromServer(questionChoiceOption: QuestionChoiceOption): QuestionChoiceOption {
        const copy: QuestionChoiceOption = Object.assign({}, questionChoiceOption);
        return copy;
    }

    /**
     * Convert a QuestionChoiceOption to a JSON which can be sent to the server.
     */
    private convert(questionChoiceOption: QuestionChoiceOption): QuestionChoiceOption {
        const copy: QuestionChoiceOption = Object.assign({}, questionChoiceOption);
        return copy;
    }
}
