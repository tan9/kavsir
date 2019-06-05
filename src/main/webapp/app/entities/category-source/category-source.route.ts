import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CategorySource } from 'app/shared/model/category-source.model';
import { CategorySourceService } from './category-source.service';
import { CategorySourceComponent } from './category-source.component';
import { CategorySourceDetailComponent } from './category-source-detail.component';
import { CategorySourceUpdateComponent } from './category-source-update.component';
import { CategorySourceDeletePopupComponent } from './category-source-delete-dialog.component';
import { ICategorySource } from 'app/shared/model/category-source.model';

@Injectable({ providedIn: 'root' })
export class CategorySourceResolve implements Resolve<ICategorySource> {
  constructor(private service: CategorySourceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategorySource> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CategorySource>) => response.ok),
        map((categorySource: HttpResponse<CategorySource>) => categorySource.body)
      );
    }
    return of(new CategorySource());
  }
}

export const categorySourceRoute: Routes = [
  {
    path: '',
    component: CategorySourceComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySource.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CategorySourceDetailComponent,
    resolve: {
      categorySource: CategorySourceResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySource.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CategorySourceUpdateComponent,
    resolve: {
      categorySource: CategorySourceResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySource.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CategorySourceUpdateComponent,
    resolve: {
      categorySource: CategorySourceResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySource.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const categorySourcePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CategorySourceDeletePopupComponent,
    resolve: {
      categorySource: CategorySourceResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySource.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
