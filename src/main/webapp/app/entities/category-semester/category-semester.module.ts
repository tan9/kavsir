import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  CategorySemesterComponent,
  CategorySemesterDetailComponent,
  CategorySemesterUpdateComponent,
  CategorySemesterDeletePopupComponent,
  CategorySemesterDeleteDialogComponent,
  categorySemesterRoute,
  categorySemesterPopupRoute
} from './';

const ENTITY_STATES = [...categorySemesterRoute, ...categorySemesterPopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CategorySemesterComponent,
    CategorySemesterDetailComponent,
    CategorySemesterUpdateComponent,
    CategorySemesterDeleteDialogComponent,
    CategorySemesterDeletePopupComponent
  ],
  entryComponents: [
    CategorySemesterComponent,
    CategorySemesterUpdateComponent,
    CategorySemesterDeleteDialogComponent,
    CategorySemesterDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirCategorySemesterModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
