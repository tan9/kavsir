import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { QuestionChoiceOptionComponent } from './question-choice-option.component';
import { QuestionChoiceOptionDetailComponent } from './question-choice-option-detail.component';
import { QuestionChoiceOptionPopupComponent } from './question-choice-option-dialog.component';
import { QuestionChoiceOptionDeletePopupComponent } from './question-choice-option-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class QuestionChoiceOptionResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const questionChoiceOptionRoute: Routes = [
    {
        path: 'question-choice-option',
        component: QuestionChoiceOptionComponent,
        resolve: {
            'pagingParams': QuestionChoiceOptionResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionChoiceOption.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'question-choice-option/:id',
        component: QuestionChoiceOptionDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionChoiceOption.home.title'
        },
        canActivate: [UserRouteAccessService]
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
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-choice-option/:id/edit',
        component: QuestionChoiceOptionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionChoiceOption.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-choice-option/:id/delete',
        component: QuestionChoiceOptionDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionChoiceOption.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
