import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICategorySubject } from 'app/shared/model/category-subject.model';
import { CategoryService } from '../category.service';

type EntityResponseType = HttpResponse<ICategorySubject>;
type EntityArrayResponseType = HttpResponse<ICategorySubject[]>;

@Injectable({ providedIn: 'root' })
export class CategorySubjectService implements CategoryService<ICategorySubject> {
  public resourceUrl = SERVER_API_URL + 'api/category-subjects';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/category-subjects';

  constructor(protected http: HttpClient) {}

  create(categorySubject: ICategorySubject): Observable<EntityResponseType> {
    return this.http.post<ICategorySubject>(this.resourceUrl, categorySubject, { observe: 'response' });
  }

  update(categorySubject: ICategorySubject): Observable<EntityResponseType> {
    return this.http.put<ICategorySubject>(this.resourceUrl, categorySubject, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategorySubject>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategorySubject[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategorySubject[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
