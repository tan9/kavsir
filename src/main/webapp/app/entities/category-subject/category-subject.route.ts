import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CategorySubject } from 'app/shared/model/category-subject.model';
import { CategorySubjectService } from './category-subject.service';
import { CategorySubjectComponent } from './category-subject.component';
import { CategorySubjectDetailComponent } from './category-subject-detail.component';
import { CategorySubjectUpdateComponent } from './category-subject-update.component';
import { CategorySubjectDeletePopupComponent } from './category-subject-delete-dialog.component';
import { ICategorySubject } from 'app/shared/model/category-subject.model';

@Injectable({ providedIn: 'root' })
export class CategorySubjectResolve implements Resolve<ICategorySubject> {
  constructor(private service: CategorySubjectService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ICategorySubject> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<CategorySubject>) => response.ok),
        map((categorySubject: HttpResponse<CategorySubject>) => categorySubject.body)
      );
    }
    return of(new CategorySubject());
  }
}

export const categorySubjectRoute: Routes = [
  {
    path: '',
    component: CategorySubjectComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySubject.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: CategorySubjectDetailComponent,
    resolve: {
      categorySubject: CategorySubjectResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySubject.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: CategorySubjectUpdateComponent,
    resolve: {
      categorySubject: CategorySubjectResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySubject.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: CategorySubjectUpdateComponent,
    resolve: {
      categorySubject: CategorySubjectResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySubject.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const categorySubjectPopupRoute: Routes = [
  {
    path: ':id/delete',
    component: CategorySubjectDeletePopupComponent,
    resolve: {
      categorySubject: CategorySubjectResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.categorySubject.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
