import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  CategoryNodeComponent,
  CategoryNodeDetailComponent,
  CategoryNodeUpdateComponent,
  CategoryNodeDeletePopupComponent,
  CategoryNodeDeleteDialogComponent,
  categoryNodeRoute,
  categoryNodePopupRoute
} from './';

const ENTITY_STATES = [...categoryNodeRoute, ...categoryNodePopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CategoryNodeComponent,
    CategoryNodeDetailComponent,
    CategoryNodeUpdateComponent,
    CategoryNodeDeleteDialogComponent,
    CategoryNodeDeletePopupComponent
  ],
  entryComponents: [
    CategoryNodeComponent,
    CategoryNodeUpdateComponent,
    CategoryNodeDeleteDialogComponent,
    CategoryNodeDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategoryNodeModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
