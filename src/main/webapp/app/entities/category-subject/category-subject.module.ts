import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  CategorySubjectComponent,
  CategorySubjectDetailComponent,
  CategorySubjectUpdateComponent,
  CategorySubjectDeletePopupComponent,
  CategorySubjectDeleteDialogComponent,
  categorySubjectRoute,
  categorySubjectPopupRoute
} from './';

const ENTITY_STATES = [...categorySubjectRoute, ...categorySubjectPopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CategorySubjectComponent,
    CategorySubjectDetailComponent,
    CategorySubjectUpdateComponent,
    CategorySubjectDeleteDialogComponent,
    CategorySubjectDeletePopupComponent
  ],
  entryComponents: [
    CategorySubjectComponent,
    CategorySubjectUpdateComponent,
    CategorySubjectDeleteDialogComponent,
    CategorySubjectDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategorySubjectModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
