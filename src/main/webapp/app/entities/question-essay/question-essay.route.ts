import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { QuestionEssayComponent } from './question-essay.component';
import { QuestionEssayDetailComponent } from './question-essay-detail.component';
import { QuestionEssayPopupComponent } from './question-essay-dialog.component';
import { QuestionEssayDeletePopupComponent } from './question-essay-delete-dialog.component';

export const questionEssayRoute: Routes = [
    {
        path: 'question-essay',
        component: QuestionEssayComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionEssay.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'question-essay/:id',
        component: QuestionEssayDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionEssay.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const questionEssayPopupRoute: Routes = [
    {
        path: 'question-essay-new',
        component: QuestionEssayPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionEssay.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-essay/:id/edit',
        component: QuestionEssayPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionEssay.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-essay/:id/delete',
        component: QuestionEssayDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionEssay.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
