import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  QuestionChoiceOptionComponent,
  QuestionChoiceOptionDetailComponent,
  QuestionChoiceOptionUpdateComponent,
  QuestionChoiceOptionDeletePopupComponent,
  QuestionChoiceOptionDeleteDialogComponent,
  questionChoiceOptionRoute,
  questionChoiceOptionPopupRoute
} from './';

const ENTITY_STATES = [...questionChoiceOptionRoute, ...questionChoiceOptionPopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    QuestionChoiceOptionComponent,
    QuestionChoiceOptionDetailComponent,
    QuestionChoiceOptionUpdateComponent,
    QuestionChoiceOptionDeleteDialogComponent,
    QuestionChoiceOptionDeletePopupComponent
  ],
  entryComponents: [
    QuestionChoiceOptionComponent,
    QuestionChoiceOptionUpdateComponent,
    QuestionChoiceOptionDeleteDialogComponent,
    QuestionChoiceOptionDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionChoiceOptionModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
