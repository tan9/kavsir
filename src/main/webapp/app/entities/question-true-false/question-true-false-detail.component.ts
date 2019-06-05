import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IQuestionTrueFalse } from 'app/shared/model/question-true-false.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-question-true-false-detail',
  templateUrl: './question-true-false-detail.component.html',
  styleUrls: ['./question-true-false-detail.component.scss']
})
export class QuestionTrueFalseDetailComponent implements OnInit, OnDestroy {
  inGroup = false;

  questionTrueFalse: IQuestionTrueFalse;
  private queryParamsSubscription: Subscription;
  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionTrueFalse }) => {
      this.questionTrueFalse = questionTrueFalse;
    });
    this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(queryParams => {
      this.inGroup = queryParams['group'] !== 'false';
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

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
  }
}
