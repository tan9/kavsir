import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IQuestionChoice } from 'app/shared/model/question-choice.model';

@Component({
  selector: 'jhi-question-choice-detail',
  templateUrl: './question-choice-detail.component.html'
})
export class QuestionChoiceDetailComponent implements OnInit {
  questionChoice: IQuestionChoice;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionChoice }) => {
      this.questionChoice = questionChoice;
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
