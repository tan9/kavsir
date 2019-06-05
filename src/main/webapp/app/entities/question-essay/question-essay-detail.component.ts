import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IQuestionEssay } from 'app/shared/model/question-essay.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-question-essay-detail',
  templateUrl: './question-essay-detail.component.html',
  styleUrls: ['./question-essay-detail.component.scss']
})
export class QuestionEssayDetailComponent implements OnInit, OnDestroy {
  inGroup = false;

  questionEssay: IQuestionEssay;
  private queryParamsSubscription: Subscription;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionEssay }) => {
      this.questionEssay = questionEssay;
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
