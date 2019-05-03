import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IQuestionTrueFalse } from 'app/shared/model/question-true-false.model';

@Component({
  selector: 'jhi-question-true-false-detail',
  templateUrl: './question-true-false-detail.component.html'
})
export class QuestionTrueFalseDetailComponent implements OnInit {
  questionTrueFalse: IQuestionTrueFalse;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionTrueFalse }) => {
      this.questionTrueFalse = questionTrueFalse;
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
