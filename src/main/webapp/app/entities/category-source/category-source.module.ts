import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  CategorySourceComponent,
  CategorySourceDetailComponent,
  CategorySourceUpdateComponent,
  CategorySourceDeletePopupComponent,
  CategorySourceDeleteDialogComponent,
  categorySourceRoute,
  categorySourcePopupRoute
} from './';

const ENTITY_STATES = [...categorySourceRoute, ...categorySourcePopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forRoot(ENTITY_STATES, { useHash: true })],
  declarations: [
    CategorySourceComponent,
    CategorySourceDetailComponent,
    CategorySourceUpdateComponent,
    CategorySourceDeleteDialogComponent,
    CategorySourceDeletePopupComponent
  ],
  entryComponents: [
    CategorySourceComponent,
    CategorySourceUpdateComponent,
    CategorySourceDeleteDialogComponent,
    CategorySourceDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategorySourceModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
