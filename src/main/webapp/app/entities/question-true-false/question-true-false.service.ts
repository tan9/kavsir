import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { QuestionTrueFalse } from './question-true-false.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class QuestionTrueFalseService {

    private resourceUrl = SERVER_API_URL + 'api/question-true-falses';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/question-true-falses';

    constructor(private http: Http) { }

    create(questionTrueFalse: QuestionTrueFalse): Observable<QuestionTrueFalse> {
        const copy = this.convert(questionTrueFalse);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(questionTrueFalse: QuestionTrueFalse): Observable<QuestionTrueFalse> {
        const copy = this.convert(questionTrueFalse);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<QuestionTrueFalse> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
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
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to QuestionTrueFalse.
     */
    private convertItemFromServer(json: any): QuestionTrueFalse {
        const entity: QuestionTrueFalse = Object.assign(new QuestionTrueFalse(), json);
        return entity;
    }

    /**
     * Convert a QuestionTrueFalse to a JSON which can be sent to the server.
     */
    private convert(questionTrueFalse: QuestionTrueFalse): QuestionTrueFalse {
        const copy: QuestionTrueFalse = Object.assign({}, questionTrueFalse);
        return copy;
    }
}
