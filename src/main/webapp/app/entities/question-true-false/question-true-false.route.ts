import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { QuestionTrueFalseComponent } from './question-true-false.component';
import { QuestionTrueFalseDetailComponent } from './question-true-false-detail.component';
import { QuestionTrueFalsePopupComponent } from './question-true-false-dialog.component';
import { QuestionTrueFalseDeletePopupComponent } from './question-true-false-delete-dialog.component';

import { Principal } from '../../shared';

export const questionTrueFalseRoute: Routes = [
    {
        path: 'question-true-false',
        component: QuestionTrueFalseComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionTrueFalse.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'question-true-false/:id',
        component: QuestionTrueFalseDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionTrueFalse.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const questionTrueFalsePopupRoute: Routes = [
    {
        path: 'question-true-false-new',
        component: QuestionTrueFalsePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionTrueFalse.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-true-false/:id/edit',
        component: QuestionTrueFalsePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionTrueFalse.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-true-false/:id/delete',
        component: QuestionTrueFalseDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionTrueFalse.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
