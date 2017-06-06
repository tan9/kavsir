import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../../shared';
import { EssayComponent } from './essay.component';

export const essayRoute: Routes = [
    {
        path: 'question/essay',
        component: EssayComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'question.type.essay'
        },
        canActivate: [UserRouteAccessService]
    }
];
