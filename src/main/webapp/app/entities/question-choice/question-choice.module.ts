import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  QuestionChoiceComponent,
  QuestionChoiceDetailComponent,
  QuestionChoiceUpdateComponent,
  QuestionChoiceDeletePopupComponent,
  QuestionChoiceDeleteDialogComponent,
  questionChoiceRoute,
  questionChoicePopupRoute
} from './';

const ENTITY_STATES = [...questionChoiceRoute, ...questionChoicePopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    QuestionChoiceComponent,
    QuestionChoiceDetailComponent,
    QuestionChoiceUpdateComponent,
    QuestionChoiceDeleteDialogComponent,
    QuestionChoiceDeletePopupComponent
  ],
  entryComponents: [
    QuestionChoiceComponent,
    QuestionChoiceUpdateComponent,
    QuestionChoiceDeleteDialogComponent,
    QuestionChoiceDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionChoiceModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
