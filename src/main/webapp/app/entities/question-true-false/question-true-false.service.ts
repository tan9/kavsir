import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IQuestionTrueFalse } from 'app/shared/model/question-true-false.model';

type EntityResponseType = HttpResponse<IQuestionTrueFalse>;
type EntityArrayResponseType = HttpResponse<IQuestionTrueFalse[]>;

@Injectable({ providedIn: 'root' })
export class QuestionTrueFalseService {
  public resourceUrl = SERVER_API_URL + 'api/question-true-falses';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/question-true-falses';

  constructor(protected http: HttpClient) {}

  create(questionTrueFalse: IQuestionTrueFalse): Observable<EntityResponseType> {
    return this.http.post<IQuestionTrueFalse>(this.resourceUrl, questionTrueFalse, { observe: 'response' });
  }

  update(questionTrueFalse: IQuestionTrueFalse): Observable<EntityResponseType> {
    return this.http.put<IQuestionTrueFalse>(this.resourceUrl, questionTrueFalse, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQuestionTrueFalse>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    if (req && req.categories) {
      options.append('categories', req.categories);
    }
    return this.http.get<IQuestionTrueFalse[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    if (req && req.categories) {
      options.append('categories', req.categories);
    }
    return this.http.get<IQuestionTrueFalse[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
