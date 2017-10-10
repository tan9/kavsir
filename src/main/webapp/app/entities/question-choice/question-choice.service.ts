import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { QuestionChoice } from './question-choice.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class QuestionChoiceService {

    private resourceUrl = SERVER_API_URL + 'api/question-choices';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/question-choices';

    constructor(private http: Http) { }

    create(questionChoice: QuestionChoice): Observable<QuestionChoice> {
        const copy = this.convert(questionChoice);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(questionChoice: QuestionChoice): Observable<QuestionChoice> {
        const copy = this.convert(questionChoice);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<QuestionChoice> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        if (req && req.categories) {
            options.params.append('categories', req.categories);
        }
        if (req && req.hasOwnProperty('multi')) {
            options.params.append('multi', req.multi);
        }
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        if (req && req.categories) {
            options.params.append('categories', req.categories);
        }
        if (req && req.hasOwnProperty('multi')) {
            options.params.append('multi', req.multi);
        }
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
     * Convert a returned JSON object to QuestionChoice.
     */
    private convertItemFromServer(json: any): QuestionChoice {
        const entity: QuestionChoice = Object.assign(new QuestionChoice(), json);
        return entity;
    }

    /**
     * Convert a QuestionChoice to a JSON which can be sent to the server.
     */
    private convert(questionChoice: QuestionChoice): QuestionChoice {
        const copy: QuestionChoice = Object.assign({}, questionChoice);
        return copy;
    }
}
