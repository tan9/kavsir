import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CategoryAcademicYear } from 'app/shared/model/category-academic-year.model';
import { CategoryAcademicYearService } from './category-academic-year.service';
import { CategoryAcademicYearComponent } from './category-academic-year.component';
import { CategoryAcademicYearDetailComponent } from './category-academic-year-detail.component';
import { CategoryAcademicYearUpdateComponent } from './category-academic-year-update.component';
import { CategoryAcademicYearDeletePopupComponent } from './category-academic-year-delete-dialog.component';
import { ICategoryAcademicYear } from 'app/shared/model/category-academic-year.model';

@Injectable({ providedIn: 'root' })
export class CategoryAcademicYearResolve implements Resolve<ICategoryAcademicYear> {
  constructor(private service: CategoryAcademicYearService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategoryAcademicYear> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CategoryAcademicYear>) => response.ok),
        map((categoryAcademicYear: HttpResponse<CategoryAcademicYear>) => categoryAcademicYear.body)
      );
    }
    return of(new CategoryAcademicYear());
  }
}

export const categoryAcademicYearRoute: Routes = [
  {
    path: '',
    component: CategoryAcademicYearComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryAcademicYear.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CategoryAcademicYearDetailComponent,
    resolve: {
      categoryAcademicYear: CategoryAcademicYearResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryAcademicYear.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CategoryAcademicYearUpdateComponent,
    resolve: {
      categoryAcademicYear: CategoryAcademicYearResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryAcademicYear.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CategoryAcademicYearUpdateComponent,
    resolve: {
      categoryAcademicYear: CategoryAcademicYearResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryAcademicYear.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const categoryAcademicYearPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CategoryAcademicYearDeletePopupComponent,
    resolve: {
      categoryAcademicYear: CategoryAcademicYearResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categoryAcademicYear.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
