import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IQuestionChoiceOption } from 'app/shared/model/question-choice-option.model';

type EntityResponseType = HttpResponse<IQuestionChoiceOption>;
type EntityArrayResponseType = HttpResponse<IQuestionChoiceOption[]>;

@Injectable({ providedIn: 'root' })
export class QuestionChoiceOptionService {
  public resourceUrl = SERVER_API_URL + 'api/question-choice-options';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/question-choice-options';

  constructor(protected http: HttpClient) {}

  create(questionChoiceOption: IQuestionChoiceOption): Observable<EntityResponseType> {
    return this.http.post<IQuestionChoiceOption>(this.resourceUrl, questionChoiceOption, { observe: 'response' });
  }

  update(questionChoiceOption: IQuestionChoiceOption): Observable<EntityResponseType> {
    return this.http.put<IQuestionChoiceOption>(this.resourceUrl, questionChoiceOption, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IQuestionChoiceOption>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IQuestionChoiceOption[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IQuestionChoiceOption[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
