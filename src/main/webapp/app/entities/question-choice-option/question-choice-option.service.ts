import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { QuestionChoiceOption } from './question-choice-option.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class QuestionChoiceOptionService {

    private resourceUrl = SERVER_API_URL + 'api/question-choice-options';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/question-choice-options';

    constructor(private http: Http) { }

    create(questionChoiceOption: QuestionChoiceOption): Observable<QuestionChoiceOption> {
        const copy = this.convert(questionChoiceOption);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(questionChoiceOption: QuestionChoiceOption): Observable<QuestionChoiceOption> {
        const copy = this.convert(questionChoiceOption);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<QuestionChoiceOption> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        if (req && req.questionChoiceId) {
            options.params.append('questionChoiceId', req.questionChoiceId);
        }
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
     * Convert a returned JSON object to QuestionChoiceOption.
     */
    private convertItemFromServer(json: any): QuestionChoiceOption {
        const entity: QuestionChoiceOption = Object.assign(new QuestionChoiceOption(), json);
        return entity;
    }

    /**
     * Convert a QuestionChoiceOption to a JSON which can be sent to the server.
     */
    private convert(questionChoiceOption: QuestionChoiceOption): QuestionChoiceOption {
        const copy: QuestionChoiceOption = Object.assign({}, questionChoiceOption);
        return copy;
    }
}
