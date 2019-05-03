import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CategoryNode } from 'app/shared/model/category-node.model';
import { CategoryNodeService } from './category-node.service';
import { CategoryNodeComponent } from './category-node.component';
import { CategoryNodeDetailComponent } from './category-node-detail.component';
import { CategoryNodeUpdateComponent } from './category-node-update.component';
import { CategoryNodeDeletePopupComponent } from './category-node-delete-dialog.component';
import { ICategoryNode } from 'app/shared/model/category-node.model';

@Injectable({ providedIn: 'root' })
export class CategoryNodeResolve implements Resolve<ICategoryNode> {
  constructor(private service: CategoryNodeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategoryNode> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CategoryNode>) => response.ok),
        map((categoryNode: HttpResponse<CategoryNode>) => categoryNode.body)
      );
    }
    return of(new CategoryNode());
  }
}

export const categoryNodeRoute: Routes = [
  {
    path: '',
    component: CategoryNodeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'kavsirApp.categoryNode.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CategoryNodeDetailComponent,
    resolve: {
      categoryNode: CategoryNodeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryNode.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CategoryNodeUpdateComponent,
    resolve: {
      categoryNode: CategoryNodeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryNode.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CategoryNodeUpdateComponent,
    resolve: {
      categoryNode: CategoryNodeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryNode.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const categoryNodePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CategoryNodeDeletePopupComponent,
    resolve: {
      categoryNode: CategoryNodeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryNode.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
