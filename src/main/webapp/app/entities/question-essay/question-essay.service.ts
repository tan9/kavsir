import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { QuestionEssay } from './question-essay.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class QuestionEssayService {

    private resourceUrl = 'api/question-essays';
    private resourceSearchUrl = 'api/_search/question-essays';

    constructor(private http: Http) { }

    create(questionEssay: QuestionEssay): Observable<QuestionEssay> {
        const copy = this.convert(questionEssay);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    update(questionEssay: QuestionEssay): Observable<QuestionEssay> {
        const copy = this.convert(questionEssay);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            return res.json();
        });
    }

    find(id: number): Observable<QuestionEssay> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            return res.json();
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        if (req && req.categories) {
            options.params.append('categories', req.categories);
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
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(questionEssay: QuestionEssay): QuestionEssay {
        const copy: QuestionEssay = Object.assign({}, questionEssay);
        return copy;
    }
}
