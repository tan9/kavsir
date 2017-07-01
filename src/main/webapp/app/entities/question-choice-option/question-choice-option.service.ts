import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { QuestionChoiceOption } from './question-choice-option.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class QuestionChoiceOptionService {

    private resourceUrl = 'api/question-choice-options';
    private resourceSearchUrl = 'api/_search/question-choice-options';

    constructor(private http: Http) { }

    create(questionChoiceOption: QuestionChoiceOption): Observable<QuestionChoiceOption> {
        const copy = this.convert(questionChoiceOption);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(questionChoiceOption: QuestionChoiceOption): Observable<QuestionChoiceOption> {
        const copy = this.convert(questionChoiceOption);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<QuestionChoiceOption> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
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
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(questionChoiceOption: QuestionChoiceOption): QuestionChoiceOption {
        const copy: QuestionChoiceOption = Object.assign({}, questionChoiceOption);
        return copy;
    }
}
