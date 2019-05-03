import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ResourceImage } from 'app/shared/model/resource-image.model';
import { ResourceImageService } from './resource-image.service';
import { ResourceImageComponent } from './resource-image.component';
import { ResourceImageDetailComponent } from './resource-image-detail.component';
import { ResourceImageUpdateComponent } from './resource-image-update.component';
import { ResourceImageDeletePopupComponent } from './resource-image-delete-dialog.component';
import { IResourceImage } from 'app/shared/model/resource-image.model';

@Injectable({ providedIn: 'root' })
export class ResourceImageResolve implements Resolve<IResourceImage> {
  constructor(private service: ResourceImageService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IResourceImage> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ResourceImage>) => response.ok),
        map((resourceImage: HttpResponse<ResourceImage>) => resourceImage.body)
      );
    }
    return of(new ResourceImage());
  }
}

export const resourceImageRoute: Routes = [
  {
    path: '',
    component: ResourceImageComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'kavsirApp.resourceImage.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: ResourceImageDetailComponent,
    resolve: {
      resourceImage: ResourceImageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.resourceImage.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: ResourceImageUpdateComponent,
    resolve: {
      resourceImage: ResourceImageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.resourceImage.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: ResourceImageUpdateComponent,
    resolve: {
      resourceImage: ResourceImageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.resourceImage.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const resourceImagePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: ResourceImageDeletePopupComponent,
    resolve: {
      resourceImage: ResourceImageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'kavsirApp.resourceImage.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
