import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { QuestionChoiceOption } from 'app/shared/model/question-choice-option.model';
import { QuestionChoiceOptionService } from './question-choice-option.service';
import { QuestionChoiceOptionComponent } from './question-choice-option.component';
import { QuestionChoiceOptionDetailComponent } from './question-choice-option-detail.component';
import { QuestionChoiceOptionUpdateComponent } from './question-choice-option-update.component';
import { QuestionChoiceOptionDeletePopupComponent } from './question-choice-option-delete-dialog.component';
import { IQuestionChoiceOption } from 'app/shared/model/question-choice-option.model';

@Injectable({ providedIn: 'root' })
export class QuestionChoiceOptionResolve implements Resolve<IQuestionChoiceOption> {
  constructor(private service: QuestionChoiceOptionService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IQuestionChoiceOption> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<QuestionChoiceOption>) => response.ok),
        map((questionChoiceOption: HttpResponse<QuestionChoiceOption>) => questionChoiceOption.body)
      );
    }
    return of(new QuestionChoiceOption());
  }
}

export const questionChoiceOptionRoute: Routes = [
  {
    path: '',
    component: QuestionChoiceOptionComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'kavsirApp.questionChoiceOption.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: QuestionChoiceOptionDetailComponent,
    resolve: {
      questionChoiceOption: QuestionChoiceOptionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionChoiceOption.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: QuestionChoiceOptionUpdateComponent,
    resolve: {
      questionChoiceOption: QuestionChoiceOptionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionChoiceOption.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: QuestionChoiceOptionUpdateComponent,
    resolve: {
      questionChoiceOption: QuestionChoiceOptionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionChoiceOption.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const questionChoiceOptionPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: QuestionChoiceOptionDeletePopupComponent,
    resolve: {
      questionChoiceOption: QuestionChoiceOptionResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.questionChoiceOption.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
