import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { QuestionChoiceComponent } from './question-choice.component';
import { QuestionChoiceDetailComponent } from './question-choice-detail.component';
import { QuestionChoicePopupComponent } from './question-choice-dialog.component';
import { QuestionChoiceDeletePopupComponent } from './question-choice-delete-dialog.component';

@Injectable()
export class QuestionChoiceResolvePagingParams implements Resolve<any> {

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

export const questionChoiceRoute: Routes = [
    {
        path: 'question-choice',
        component: QuestionChoiceComponent,
        resolve: {
            'pagingParams': QuestionChoiceResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionChoice.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'question-choice/:id',
        component: QuestionChoiceDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionChoice.home.title'
        },
        canActivate: [UserRouteAccessService]
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
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-choice/:id/edit',
        component: QuestionChoicePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionChoice.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question-choice/:id/delete',
        component: QuestionChoiceDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.questionChoice.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
