import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  CategoryGradeComponent,
  CategoryGradeDetailComponent,
  CategoryGradeUpdateComponent,
  CategoryGradeDeletePopupComponent,
  CategoryGradeDeleteDialogComponent,
  categoryGradeRoute,
  categoryGradePopupRoute
} from './';

const ENTITY_STATES = [...categoryGradeRoute, ...categoryGradePopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CategoryGradeComponent,
    CategoryGradeDetailComponent,
    CategoryGradeUpdateComponent,
    CategoryGradeDeleteDialogComponent,
    CategoryGradeDeletePopupComponent
  ],
  entryComponents: [
    CategoryGradeComponent,
    CategoryGradeUpdateComponent,
    CategoryGradeDeleteDialogComponent,
    CategoryGradeDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategoryGradeModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
