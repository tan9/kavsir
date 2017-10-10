import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { SERVER_API_URL } from '../../app.constants';

import { CategoryAcademicYear } from './category-academic-year.model';
import { ResponseWrapper, createRequestOption } from '../../shared';
import { CategoryService } from '../category.service';

@Injectable()
export class CategoryAcademicYearService implements CategoryService<CategoryAcademicYear> {

    private resourceUrl = SERVER_API_URL + 'api/category-academic-years';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/category-academic-years';

    constructor(private http: Http) { }

    create(categoryAcademicYear: CategoryAcademicYear): Observable<CategoryAcademicYear> {
        const copy = this.convert(categoryAcademicYear);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(categoryAcademicYear: CategoryAcademicYear): Observable<CategoryAcademicYear> {
        const copy = this.convert(categoryAcademicYear);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<CategoryAcademicYear> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to CategoryAcademicYear.
     */
    private convertItemFromServer(json: any): CategoryAcademicYear {
        const entity: CategoryAcademicYear = Object.assign(new CategoryAcademicYear(), json);
        return entity;
    }

    /**
     * Convert a CategoryAcademicYear to a JSON which can be sent to the server.
     */
    private convert(categoryAcademicYear: CategoryAcademicYear): CategoryAcademicYear {
        const copy: CategoryAcademicYear = Object.assign({}, categoryAcademicYear);
        return copy;
    }
}
