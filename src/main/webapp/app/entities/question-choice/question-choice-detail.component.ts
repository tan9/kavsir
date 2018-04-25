import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { QuestionChoice } from './question-choice.model';
import { QuestionChoiceService } from './question-choice.service';

@Component({
    selector: 'jhi-question-choice-detail',
    templateUrl: './question-choice-detail.component.html',
    styleUrls: [ './question-choice-detail.component.css' ]
})
export class QuestionChoiceDetailComponent implements OnInit, OnDestroy {

    inGroup = false;

    questionChoice: QuestionChoice;
    private subscription: Subscription;
    private queryParamsSubscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private questionChoiceService: QuestionChoiceService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.queryParamsSubscription = this.route.queryParams.subscribe((queryParams) => {
                this.inGroup = queryParams['group'] !== 'false';
            }
        );
        this.registerChangeInQuestionChoices();
    }

    load(id) {
        this.questionChoiceService.find(id)
            .subscribe((questionChoiceResponse: HttpResponse<QuestionChoice>) => {
                this.questionChoice = questionChoiceResponse.body;
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
        this.subscription.unsubscribe();
        this.queryParamsSubscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionChoices() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionChoiceListModification',
            (response) => this.load(this.questionChoice.id)
        );
    }
}
