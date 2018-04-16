import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { QuestionTrueFalse } from './question-true-false.model';
import { QuestionTrueFalseService } from './question-true-false.service';

@Component({
    selector: 'jhi-question-true-false-detail',
    templateUrl: './question-true-false-detail.component.html'
})
export class QuestionTrueFalseDetailComponent implements OnInit, OnDestroy {

    questionTrueFalse: QuestionTrueFalse;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private questionTrueFalseService: QuestionTrueFalseService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuestionTrueFalses();
    }

    load(id) {
        this.questionTrueFalseService.find(id)
            .subscribe((questionTrueFalseResponse: HttpResponse<QuestionTrueFalse>) => {
                this.questionTrueFalse = questionTrueFalseResponse.body;
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
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionTrueFalses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionTrueFalseListModification',
            (response) => this.load(this.questionTrueFalse.id)
        );
    }
}
