import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICategorySemester } from 'app/shared/model/category-semester.model';

type EntityResponseType = HttpResponse<ICategorySemester>;
type EntityArrayResponseType = HttpResponse<ICategorySemester[]>;

@Injectable({ providedIn: 'root' })
export class CategorySemesterService {
  public resourceUrl = SERVER_API_URL + 'api/category-semesters';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/category-semesters';

  constructor(protected http: HttpClient) {}

  create(categorySemester: ICategorySemester): Observable<EntityResponseType> {
    return this.http.post<ICategorySemester>(this.resourceUrl, categorySemester, { observe: 'response' });
  }

  update(categorySemester: ICategorySemester): Observable<EntityResponseType> {
    return this.http.put<ICategorySemester>(this.resourceUrl, categorySemester, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategorySemester>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategorySemester[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategorySemester[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
