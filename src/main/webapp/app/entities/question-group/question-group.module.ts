import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  QuestionGroupComponent,
  QuestionGroupDetailComponent,
  QuestionGroupUpdateComponent,
  QuestionGroupDeletePopupComponent,
  QuestionGroupDeleteDialogComponent,
  questionGroupRoute,
  questionGroupPopupRoute
} from './';

const ENTITY_STATES = [...questionGroupRoute, ...questionGroupPopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    QuestionGroupComponent,
    QuestionGroupDetailComponent,
    QuestionGroupUpdateComponent,
    QuestionGroupDeleteDialogComponent,
    QuestionGroupDeletePopupComponent
  ],
  entryComponents: [
    QuestionGroupComponent,
    QuestionGroupUpdateComponent,
    QuestionGroupDeleteDialogComponent,
    QuestionGroupDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionGroupModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
