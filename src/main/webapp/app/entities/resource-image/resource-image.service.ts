import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IResourceImage } from 'app/shared/model/resource-image.model';

type EntityResponseType = HttpResponse<IResourceImage>;
type EntityArrayResponseType = HttpResponse<IResourceImage[]>;

@Injectable({ providedIn: 'root' })
export class ResourceImageService {
  public resourceUrl = SERVER_API_URL + 'api/resource-images';
  public resourceSearchUrl = SERVER_API_URL + 'api/_search/resource-images';

  constructor(protected http: HttpClient) {}

  create(resourceImage: IResourceImage): Observable<EntityResponseType> {
    return this.http.post<IResourceImage>(this.resourceUrl, resourceImage, { observe: 'response' });
  }

  update(resourceImage: IResourceImage): Observable<EntityResponseType> {
    return this.http.put<IResourceImage>(this.resourceUrl, resourceImage, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IResourceImage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResourceImage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IResourceImage[]>(this.resourceSearchUrl, { params: options, observe: 'response' });
  }
}
