import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IQuestionChoice } from 'app/shared/model/question-choice.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-question-choice-detail',
  templateUrl: './question-choice-detail.component.html',
  styleUrls: ['./question-choice-detail.component.scss']
})
export class QuestionChoiceDetailComponent implements OnInit, OnDestroy {
  inGroup = false;

  questionChoice: IQuestionChoice;
  private queryParamsSubscription: Subscription;

  constructor(protected dataUtils: JhiDataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ questionChoice }) => {
      this.questionChoice = questionChoice;
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
