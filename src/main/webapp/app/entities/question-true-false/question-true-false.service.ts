import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { QuestionTrueFalse } from './question-true-false.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class QuestionTrueFalseService {

    private resourceUrl = 'api/question-true-falses';
    private resourceSearchUrl = 'api/_search/question-true-falses';

    constructor(private http: Http) { }

    create(questionTrueFalse: QuestionTrueFalse): Observable<QuestionTrueFalse> {
        const copy = this.convert(questionTrueFalse);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(questionTrueFalse: QuestionTrueFalse): Observable<QuestionTrueFalse> {
        const copy = this.convert(questionTrueFalse);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<QuestionTrueFalse> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
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
        return new ResponseWrapper(res.headers, jsonResponse);
    }

    private convert(questionTrueFalse: QuestionTrueFalse): QuestionTrueFalse {
        const copy: QuestionTrueFalse = Object.assign({}, questionTrueFalse);
        return copy;
    }
}