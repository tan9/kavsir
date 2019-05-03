import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICategorySource } from 'app/shared/model/category-source.model';

type EntityResponseType = HttpResponse<ICategorySource>;
type EntityArrayResponseType = HttpResponse<ICategorySource[]>;

@Injectable({ providedIn: 'root' })
export class CategorySourceService {
  public resourceUrl = SERVER_API_URL + 'api/category-sources';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/category-sources';

  constructor(protected http: HttpClient) {}

  create(categorySource: ICategorySource): Observable<EntityResponseType> {
    return this.http.post<ICategorySource>(this.resourceUrl, categorySource, { observe: 'response' });
  }

  update(categorySource: ICategorySource): Observable<EntityResponseType> {
    return this.http.put<ICategorySource>(this.resourceUrl, categorySource, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategorySource>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategorySource[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategorySource[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
