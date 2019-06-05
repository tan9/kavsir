import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICategoryGrade } from 'app/shared/model/category-grade.model';
import { CategoryService } from 'app/entities/category.service';

type EntityResponseType = HttpResponse<ICategoryGrade>;
type EntityArrayResponseType = HttpResponse<ICategoryGrade[]>;

@Injectable({ providedIn: 'root' })
export class CategoryGradeService implements CategoryService<ICategoryGrade> {
  public resourceUrl = SERVER_API_URL + 'api/category-grades';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/category-grades';

  constructor(protected http: HttpClient) {}

  create(categoryGrade: ICategoryGrade): Observable<EntityResponseType> {
    return this.http.post<ICategoryGrade>(this.resourceUrl, categoryGrade, { observe: 'response' });
  }

  update(categoryGrade: ICategoryGrade): Observable<EntityResponseType> {
    return this.http.put<ICategoryGrade>(this.resourceUrl, categoryGrade, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategoryGrade>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategoryGrade[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategoryGrade[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
