import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../../core';
import { EssayComponent } from './essay.component';
import { JhiResolvePagingParams } from 'ng-jhipster';

export const essayRoute: Routes = [
  {
    path: 'question/essay',
    component: EssayComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'question.type.essay'
    },
    canActivate: [UserRouteAccessService]
  }
];
