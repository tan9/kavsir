import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  QuestionTrueFalseComponent,
  QuestionTrueFalseDetailComponent,
  QuestionTrueFalseUpdateComponent,
  QuestionTrueFalseDeletePopupComponent,
  QuestionTrueFalseDeleteDialogComponent,
  questionTrueFalseRoute,
  questionTrueFalsePopupRoute
} from './';

const ENTITY_STATES = [...questionTrueFalseRoute, ...questionTrueFalsePopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    QuestionTrueFalseComponent,
    QuestionTrueFalseDetailComponent,
    QuestionTrueFalseUpdateComponent,
    QuestionTrueFalseDeleteDialogComponent,
    QuestionTrueFalseDeletePopupComponent
  ],
  entryComponents: [
    QuestionTrueFalseComponent,
    QuestionTrueFalseUpdateComponent,
    QuestionTrueFalseDeleteDialogComponent,
    QuestionTrueFalseDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionTrueFalseModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
