import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IQuestionChoiceOption } from 'app/shared/model/question-choice-option.model';

@Component({
  selector: 'jhi-question-choice-option-detail',
  templateUrl: './question-choice-option-detail.component.html'
})
export class QuestionChoiceOptionDetailComponent implements OnInit {
  questionChoiceOption: IQuestionChoiceOption;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionChoiceOption }) => {
      this.questionChoiceOption = questionChoiceOption;
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
  previousState() {
    window.history.back();
  }
}
