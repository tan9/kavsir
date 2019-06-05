import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CategoryGrade } from 'app/shared/model/category-grade.model';
import { CategoryGradeService } from './category-grade.service';
import { CategoryGradeComponent } from './category-grade.component';
import { CategoryGradeDetailComponent } from './category-grade-detail.component';
import { CategoryGradeUpdateComponent } from './category-grade-update.component';
import { CategoryGradeDeletePopupComponent } from './category-grade-delete-dialog.component';
import { ICategoryGrade } from 'app/shared/model/category-grade.model';

@Injectable({ providedIn: 'root' })
export class CategoryGradeResolve implements Resolve<ICategoryGrade> {
  constructor(private service: CategoryGradeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategoryGrade> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CategoryGrade>) => response.ok),
        map((categoryGrade: HttpResponse<CategoryGrade>) => categoryGrade.body)
      );
    }
    return of(new CategoryGrade());
  }
}

export const categoryGradeRoute: Routes = [
  {
    path: '',
    component: CategoryGradeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryGrade.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CategoryGradeDetailComponent,
    resolve: {
      categoryGrade: CategoryGradeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryGrade.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CategoryGradeUpdateComponent,
    resolve: {
      categoryGrade: CategoryGradeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryGrade.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CategoryGradeUpdateComponent,
    resolve: {
      categoryGrade: CategoryGradeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryGrade.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const categoryGradePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CategoryGradeDeletePopupComponent,
    resolve: {
      categoryGrade: CategoryGradeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryGrade.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
