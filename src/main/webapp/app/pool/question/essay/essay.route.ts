import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../../shared';
import { QuestionEssayResolvePagingParams } from '../../../entities/question-essay';
import { EssayComponent } from './essay.component';

export const essayRoute: Routes = [
    {
        path: 'question/essay',
        component: EssayComponent,
        resolve: {
            'pagingParams': QuestionEssayResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'question.type.essay'
        },
        canActivate: [UserRouteAccessService]
    }
];
