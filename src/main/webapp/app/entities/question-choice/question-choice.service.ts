import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { QuestionChoice } from './question-choice.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { QuestionChoiceOptionService } from '../question-choice-option/question-choice-option.service';

@Injectable()
export class QuestionChoiceService {

    private resourceUrl = 'api/question-choices';
    private resourceSearchUrl = 'api/_search/question-choices';

    constructor(private http: Http,
                private questionChoiceOptionService: QuestionChoiceOptionService) { }

    create(questionChoice: QuestionChoice): Observable<QuestionChoice> {
        const copy = this.convert(questionChoice);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(questionChoice: QuestionChoice): Observable<QuestionChoice> {
        const copy = this.convert(questionChoice);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<QuestionChoice> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
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
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(questionChoice: QuestionChoice): QuestionChoice {
        const copy: QuestionChoice = Object.assign({}, questionChoice);
        return copy;
    }
}
