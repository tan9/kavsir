import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IQuestionGroup } from 'app/shared/model/question-group.model';

@Component({
  selector: 'jhi-question-group-detail',
  templateUrl: './question-group-detail.component.html'
})
export class QuestionGroupDetailComponent implements OnInit {
  questionGroup: IQuestionGroup;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionGroup }) => {
      this.questionGroup = questionGroup;
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
