import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IQuestionEssay } from 'app/shared/model/question-essay.model';

@Component({
  selector: 'jhi-question-essay-detail',
  templateUrl: './question-essay-detail.component.html'
})
export class QuestionEssayDetailComponent implements OnInit {
  questionEssay: IQuestionEssay;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionEssay }) => {
      this.questionEssay = questionEssay;
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
