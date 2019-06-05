import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  ResourceImageComponent,
  ResourceImageDetailComponent,
  ResourceImageUpdateComponent,
  ResourceImageDeletePopupComponent,
  ResourceImageDeleteDialogComponent,
  resourceImageRoute,
  resourceImagePopupRoute
} from './';

const ENTITY_STATES = [...resourceImageRoute, ...resourceImagePopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ResourceImageComponent,
    ResourceImageDetailComponent,
    ResourceImageUpdateComponent,
    ResourceImageDeleteDialogComponent,
    ResourceImageDeletePopupComponent
  ],
  entryComponents: [
    ResourceImageComponent,
    ResourceImageUpdateComponent,
    ResourceImageDeleteDialogComponent,
    ResourceImageDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirResourceImageModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
