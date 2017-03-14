import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { QuestionChoiceComponent } from './question-choice.component';
import { QuestionChoiceDetailComponent } from './question-choice-detail.component';
import { QuestionChoicePopupComponent } from './question-choice-dialog.component';
import { QuestionChoiceDeletePopupComponent } from './question-choice-delete-dialog.component';

import { Principal } from '../../shared';


export const questionChoiceRoute: Routes = [
  {
    path: 'question-choice',
    component: QuestionChoiceComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionChoice.home.title'
    }
  }, {
    path: 'question-choice/:id',
    component: QuestionChoiceDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionChoice.home.title'
    }
  }
];

export const questionChoicePopupRoute: Routes = [
  {
    path: 'question-choice-new',
    component: QuestionChoicePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionChoice.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'question-choice/:id/edit',
    component: QuestionChoicePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionChoice.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'question-choice/:id/delete',
    component: QuestionChoiceDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionChoice.home.title'
    },
    outlet: 'popup'
  }
];
