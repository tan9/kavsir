import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { QuestionGroupComponent } from './question-group.component';
import { QuestionGroupDetailComponent } from './question-group-detail.component';
import { QuestionGroupPopupComponent } from './question-group-dialog.component';
import { QuestionGroupDeletePopupComponent } from './question-group-delete-dialog.component';

import { Principal } from '../../shared';


export const questionGroupRoute: Routes = [
  {
    path: 'question-group',
    component: QuestionGroupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionGroup.home.title'
    }
  }, {
    path: 'question-group/:id',
    component: QuestionGroupDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionGroup.home.title'
    }
  }
];

export const questionGroupPopupRoute: Routes = [
  {
    path: 'question-group-new',
    component: QuestionGroupPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionGroup.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'question-group/:id/edit',
    component: QuestionGroupPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionGroup.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'question-group/:id/delete',
    component: QuestionGroupDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionGroup.home.title'
    },
    outlet: 'popup'
  }
];
