import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IQuestionEssay } from 'app/shared/model/question-essay.model';

type EntityResponseType = HttpResponse<IQuestionEssay>;
type EntityArrayResponseType = HttpResponse<IQuestionEssay[]>;

@Injectable({ providedIn: 'root' })
export class QuestionEssayService {
  public resourceUrl = SERVER_API_URL + 'api/question-essays';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/question-essays';

  constructor(protected http: HttpClient) {}

  create(questionEssay: IQuestionEssay): Observable<EntityResponseType> {
    return this.http.post<IQuestionEssay>(this.resourceUrl, questionEssay, { observe: 'response' });
  }

  update(questionEssay: IQuestionEssay): Observable<EntityResponseType> {
    return this.http.put<IQuestionEssay>(this.resourceUrl, questionEssay, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQuestionEssay>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    if (req && req.categories) {
      options.append('categories', req.categories);
    }
    return this.http.get<IQuestionEssay[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    if (req && req.categories) {
      options.append('categories', req.categories);
    }
    return this.http.get<IQuestionEssay[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
