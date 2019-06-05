import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { QuestionChoice } from 'app/shared/model/question-choice.model';
import { QuestionChoiceService } from './question-choice.service';
import { QuestionChoiceComponent } from './question-choice.component';
import { QuestionChoiceDetailComponent } from './question-choice-detail.component';
import { QuestionChoiceUpdateComponent } from './question-choice-update.component';
import { QuestionChoiceDeletePopupComponent } from './question-choice-delete-dialog.component';
import { IQuestionChoice } from 'app/shared/model/question-choice.model';

@Injectable({ providedIn: 'root' })
export class QuestionChoiceResolve implements Resolve<IQuestionChoice> {
  constructor(private service: QuestionChoiceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IQuestionChoice> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<QuestionChoice>) => response.ok),
        map((questionChoice: HttpResponse<QuestionChoice>) => questionChoice.body)
      );
    }
    return of(new QuestionChoice());
  }
}

export const questionChoiceRoute: Routes = [
  {
    path: '',
    component: QuestionChoiceComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'kavsirApp.questionChoice.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: QuestionChoiceDetailComponent,
    resolve: {
      questionChoice: QuestionChoiceResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionChoice.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: QuestionChoiceUpdateComponent,
    resolve: {
      questionChoice: QuestionChoiceResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionChoice.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: QuestionChoiceUpdateComponent,
    resolve: {
      questionChoice: QuestionChoiceResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionChoice.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const questionChoicePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: QuestionChoiceDeletePopupComponent,
    resolve: {
      questionChoice: QuestionChoiceResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionChoice.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
