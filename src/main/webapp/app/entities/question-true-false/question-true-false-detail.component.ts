import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager  } from 'ng-jhipster';

import { QuestionTrueFalse } from './question-true-false.model';
import { QuestionTrueFalseService } from './question-true-false.service';

@Component({
    selector: 'jhi-question-true-false-detail',
    templateUrl: './question-true-false-detail.component.html',
    styleUrls: [ './question-true-false-detail.component.css' ]
})
export class QuestionTrueFalseDetailComponent implements OnInit, OnDestroy {

    inGroup = false;

    questionTrueFalse: QuestionTrueFalse;
    private subscription: Subscription;
    private queryParamsSubscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private questionTrueFalseService: QuestionTrueFalseService,
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
        this.registerChangeInQuestionTrueFalses();
    }

    load(id) {
        this.questionTrueFalseService.find(id).subscribe((questionTrueFalse) => {
            this.questionTrueFalse = questionTrueFalse;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.queryParamsSubscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionTrueFalses() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionTrueFalseListModification',
            (response) => this.load(this.questionTrueFalse.id)
        );
    }
}
