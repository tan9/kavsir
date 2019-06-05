import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CategorySemester } from 'app/shared/model/category-semester.model';
import { CategorySemesterService } from './category-semester.service';
import { CategorySemesterComponent } from './category-semester.component';
import { CategorySemesterDetailComponent } from './category-semester-detail.component';
import { CategorySemesterUpdateComponent } from './category-semester-update.component';
import { CategorySemesterDeletePopupComponent } from './category-semester-delete-dialog.component';
import { ICategorySemester } from 'app/shared/model/category-semester.model';

@Injectable({ providedIn: 'root' })
export class CategorySemesterResolve implements Resolve<ICategorySemester> {
  constructor(private service: CategorySemesterService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategorySemester> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CategorySemester>) => response.ok),
        map((categorySemester: HttpResponse<CategorySemester>) => categorySemester.body)
      );
    }
    return of(new CategorySemester());
  }
}

export const categorySemesterRoute: Routes = [
  {
    path: '',
    component: CategorySemesterComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySemester.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CategorySemesterDetailComponent,
    resolve: {
      categorySemester: CategorySemesterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySemester.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CategorySemesterUpdateComponent,
    resolve: {
      categorySemester: CategorySemesterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySemester.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CategorySemesterUpdateComponent,
    resolve: {
      categorySemester: CategorySemesterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySemester.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const categorySemesterPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CategorySemesterDeletePopupComponent,
    resolve: {
      categorySemester: CategorySemesterResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySemester.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
