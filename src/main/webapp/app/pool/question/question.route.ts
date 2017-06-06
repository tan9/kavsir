import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { QuestionComponent } from './question.component';

export const questionRoute: Routes = [
    {
        path: 'question',
        component: QuestionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'global.menu.pool.question.main'
        },
        canActivate: [UserRouteAccessService]
    }
];
