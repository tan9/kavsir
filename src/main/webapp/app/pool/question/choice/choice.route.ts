import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../../core';
import { ChoiceComponent } from './choice.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

export const choiceRoute: Routes = [
  {
    path: 'question/choice',
    component: ChoiceComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'question.type.choice'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'question/multiple-response',
    component: ChoiceComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'question.type.multipleResponse'
    },
    canActivate: [UserRouteAccessService]
  }
];
