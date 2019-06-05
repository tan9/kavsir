import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IQuestionChoice } from 'app/shared/model/question-choice.model';

type EntityResponseType = HttpResponse<IQuestionChoice>;
type EntityArrayResponseType = HttpResponse<IQuestionChoice[]>;

@Injectable({ providedIn: 'root' })
export class QuestionChoiceService {
  public resourceUrl = SERVER_API_URL + 'api/question-choices';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/question-choices';

  constructor(protected http: HttpClient) {}

  create(questionChoice: IQuestionChoice): Observable<EntityResponseType> {
    return this.http.post<IQuestionChoice>(this.resourceUrl, questionChoice, { observe: 'response' });
  }

  update(questionChoice: IQuestionChoice): Observable<EntityResponseType> {
    return this.http.put<IQuestionChoice>(this.resourceUrl, questionChoice, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQuestionChoice>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    if (req && req.categories) {
      options.append('categories', req.categories);
    }
    if (req && req.hasOwnProperty('multi')) {
      options.append('multi', req.multi);
    }
    return this.http.get<IQuestionChoice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    if (req && req.categories) {
      options.append('categories', req.categories);
    }
    if (req && req.hasOwnProperty('multi')) {
      options.append('multi', req.multi);
    }
    return this.http.get<IQuestionChoice[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
