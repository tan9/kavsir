import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { CategoryPublisherComponent } from './category-publisher.component';
import { CategoryPublisherDetailComponent } from './category-publisher-detail.component';
import { CategoryPublisherPopupComponent } from './category-publisher-dialog.component';
import { CategoryPublisherDeletePopupComponent } from './category-publisher-delete-dialog.component';

export const categoryPublisherRoute: Routes = [
    {
        path: 'category-publisher',
        component: CategoryPublisherComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryPublisher.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'category-publisher/:id',
        component: CategoryPublisherDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryPublisher.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categoryPublisherPopupRoute: Routes = [
    {
        path: 'category-publisher-new',
        component: CategoryPublisherPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryPublisher.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-publisher/:id/edit',
        component: CategoryPublisherPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryPublisher.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'category-publisher/:id/delete',
        component: CategoryPublisherDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'kavsirApp.categoryPublisher.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
