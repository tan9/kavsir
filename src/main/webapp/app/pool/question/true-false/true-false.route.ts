import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../../core';
import { TrueFalseComponent } from './true-false.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

export const trueFalseRoute: Routes = [
  {
    path: 'question/true-false',
    component: TrueFalseComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'question.type.trueFalse'
    },
    canActivate: [UserRouteAccessService]
  }
];
