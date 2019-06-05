import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { QuestionGroup } from 'app/shared/model/question-group.model';
import { QuestionGroupService } from './question-group.service';
import { QuestionGroupComponent } from './question-group.component';
import { QuestionGroupDetailComponent } from './question-group-detail.component';
import { QuestionGroupUpdateComponent } from './question-group-update.component';
import { QuestionGroupDeletePopupComponent } from './question-group-delete-dialog.component';
import { IQuestionGroup } from 'app/shared/model/question-group.model';

@Injectable({ providedIn: 'root' })
export class QuestionGroupResolve implements Resolve<IQuestionGroup> {
  constructor(private service: QuestionGroupService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IQuestionGroup> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<QuestionGroup>) => response.ok),
        map((questionGroup: HttpResponse<QuestionGroup>) => questionGroup.body)
      );
    }
    return of(new QuestionGroup());
  }
}

export const questionGroupRoute: Routes = [
  {
    path: '',
    component: QuestionGroupComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'kavsirApp.questionGroup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: QuestionGroupDetailComponent,
    resolve: {
      questionGroup: QuestionGroupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionGroup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: QuestionGroupUpdateComponent,
    resolve: {
      questionGroup: QuestionGroupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionGroup.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: QuestionGroupUpdateComponent,
    resolve: {
      questionGroup: QuestionGroupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionGroup.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const questionGroupPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: QuestionGroupDeletePopupComponent,
    resolve: {
      questionGroup: QuestionGroupResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionGroup.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
