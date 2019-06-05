import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper } from 'app/core';

import { KavsirSharedModule } from 'app/shared';
import {
  QuestionEssayComponent,
  QuestionEssayDetailComponent,
  QuestionEssayUpdateComponent,
  QuestionEssayDeletePopupComponent,
  QuestionEssayDeleteDialogComponent,
  questionEssayRoute,
  questionEssayPopupRoute
} from './';

const ENTITY_STATES = [...questionEssayRoute, ...questionEssayPopupRoute];

@NgModule({
  imports: [KavsirSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    QuestionEssayComponent,
    QuestionEssayDetailComponent,
    QuestionEssayUpdateComponent,
    QuestionEssayDeleteDialogComponent,
    QuestionEssayDeletePopupComponent
  ],
  entryComponents: [
    QuestionEssayComponent,
    QuestionEssayUpdateComponent,
    QuestionEssayDeleteDialogComponent,
    QuestionEssayDeletePopupComponent
  ],
  providers: [{ provide: JhiLanguageService, useClass: JhiLanguageService }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class KavsirQuestionEssayModule {
  constructor(private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper) {
    this.languageHelper.language.subscribe((languageKey: string) => {
      if (languageKey !== undefined) {
        this.languageService.changeLanguage(languageKey);
      }
    });
  }
}
