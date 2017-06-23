import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager  } from 'ng-jhipster';

import { QuestionEssay } from './question-essay.model';
import { QuestionEssayService } from './question-essay.service';

@Component({
    selector: 'jhi-question-essay-detail',
    templateUrl: './question-essay-detail.component.html'
})
export class QuestionEssayDetailComponent implements OnInit, OnDestroy {

    inGroup = false;

    questionEssay: QuestionEssay;
    private subscription: Subscription;
    private queryParamsSubscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private questionEssayService: QuestionEssayService,
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
        this.registerChangeInQuestionEssays();
    }

    load(id) {
        this.questionEssayService.find(id).subscribe((questionEssay) => {
            this.questionEssay = questionEssay;
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

    registerChangeInQuestionEssays() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionEssayListModification',
            (response) => this.load(this.questionEssay.id)
        );
    }
}
