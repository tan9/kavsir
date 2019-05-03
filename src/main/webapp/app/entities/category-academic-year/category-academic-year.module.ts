import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  CategoryAcademicYearComponent,
  CategoryAcademicYearDetailComponent,
  CategoryAcademicYearUpdateComponent,
  CategoryAcademicYearDeletePopupComponent,
  CategoryAcademicYearDeleteDialogComponent,
  categoryAcademicYearRoute,
  categoryAcademicYearPopupRoute
} from './';

const ENTITY_STATES = [...categoryAcademicYearRoute, ...categoryAcademicYearPopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CategoryAcademicYearComponent,
    CategoryAcademicYearDetailComponent,
    CategoryAcademicYearUpdateComponent,
    CategoryAcademicYearDeleteDialogComponent,
    CategoryAcademicYearDeletePopupComponent
  ],
  entryComponents: [
    CategoryAcademicYearComponent,
    CategoryAcademicYearUpdateComponent,
    CategoryAcademicYearDeleteDialogComponent,
    CategoryAcademicYearDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategoryAcademicYearModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
