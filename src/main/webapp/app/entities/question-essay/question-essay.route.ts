import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { QuestionEssay } from 'app/shared/model/question-essay.model';
import { QuestionEssayService } from './question-essay.service';
import { QuestionEssayComponent } from './question-essay.component';
import { QuestionEssayDetailComponent } from './question-essay-detail.component';
import { QuestionEssayUpdateComponent } from './question-essay-update.component';
import { QuestionEssayDeletePopupComponent } from './question-essay-delete-dialog.component';
import { IQuestionEssay } from 'app/shared/model/question-essay.model';

@Injectable({ providedIn: 'root' })
export class QuestionEssayResolve implements Resolve<IQuestionEssay> {
  constructor(private service: QuestionEssayService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IQuestionEssay> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<QuestionEssay>) => response.ok),
        map((questionEssay: HttpResponse<QuestionEssay>) => questionEssay.body)
      );
    }
    return of(new QuestionEssay());
  }
}

export const questionEssayRoute: Routes = [
  {
    path: '',
    component: QuestionEssayComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'kavsirApp.questionEssay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: QuestionEssayDetailComponent,
    resolve: {
      questionEssay: QuestionEssayResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionEssay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: QuestionEssayUpdateComponent,
    resolve: {
      questionEssay: QuestionEssayResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionEssay.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: QuestionEssayUpdateComponent,
    resolve: {
      questionEssay: QuestionEssayResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionEssay.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const questionEssayPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: QuestionEssayDeletePopupComponent,
    resolve: {
      questionEssay: QuestionEssayResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionEssay.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
