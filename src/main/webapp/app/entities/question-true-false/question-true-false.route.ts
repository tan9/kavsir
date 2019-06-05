import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { QuestionTrueFalse } from 'app/shared/model/question-true-false.model';
import { QuestionTrueFalseService } from './question-true-false.service';
import { QuestionTrueFalseComponent } from './question-true-false.component';
import { QuestionTrueFalseDetailComponent } from './question-true-false-detail.component';
import { QuestionTrueFalseUpdateComponent } from './question-true-false-update.component';
import { QuestionTrueFalseDeletePopupComponent } from './question-true-false-delete-dialog.component';
import { IQuestionTrueFalse } from 'app/shared/model/question-true-false.model';

@Injectable({ providedIn: 'root' })
export class QuestionTrueFalseResolve implements Resolve<IQuestionTrueFalse> {
  constructor(private service: QuestionTrueFalseService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IQuestionTrueFalse> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<QuestionTrueFalse>) => response.ok),
        map((questionTrueFalse: HttpResponse<QuestionTrueFalse>) => questionTrueFalse.body)
      );
    }
    return of(new QuestionTrueFalse());
  }
}

export const questionTrueFalseRoute: Routes = [
  {
    path: '',
    component: QuestionTrueFalseComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'kavsirApp.questionTrueFalse.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: QuestionTrueFalseDetailComponent,
    resolve: {
      questionTrueFalse: QuestionTrueFalseResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionTrueFalse.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: QuestionTrueFalseUpdateComponent,
    resolve: {
      questionTrueFalse: QuestionTrueFalseResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionTrueFalse.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: QuestionTrueFalseUpdateComponent,
    resolve: {
      questionTrueFalse: QuestionTrueFalseResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionTrueFalse.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const questionTrueFalsePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: QuestionTrueFalseDeletePopupComponent,
    resolve: {
      questionTrueFalse: QuestionTrueFalseResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionTrueFalse.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
