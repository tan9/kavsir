import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { QuestionChoiceOptionComponent } from './question-choice-option.component';
import { QuestionChoiceOptionDetailComponent } from './question-choice-option-detail.component';
import { QuestionChoiceOptionPopupComponent } from './question-choice-option-dialog.component';
import { QuestionChoiceOptionDeletePopupComponent } from './question-choice-option-delete-dialog.component';

import { Principal } from '../../shared';


export const questionChoiceOptionRoute: Routes = [
  {
    path: 'question-choice-option',
    component: QuestionChoiceOptionComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionChoiceOption.home.title'
    }
  }, {
    path: 'question-choice-option/:id',
    component: QuestionChoiceOptionDetailComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionChoiceOption.home.title'
    }
  }
];

export const questionChoiceOptionPopupRoute: Routes = [
  {
    path: 'question-choice-option-new',
    component: QuestionChoiceOptionPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionChoiceOption.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'question-choice-option/:id/edit',
    component: QuestionChoiceOptionPopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionChoiceOption.home.title'
    },
    outlet: 'popup'
  },
  {
    path: 'question-choice-option/:id/delete',
    component: QuestionChoiceOptionDeletePopupComponent,
    data: {
        authorities: ['ROLE_USER'],
        pageTitle: 'kavsirApp.questionChoiceOption.home.title'
    },
    outlet: 'popup'
  }
];
