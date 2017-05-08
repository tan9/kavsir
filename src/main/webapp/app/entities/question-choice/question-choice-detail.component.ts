import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager  } from 'ng-jhipster';

import { QuestionChoice } from './question-choice.model';
import { QuestionChoiceService } from './question-choice.service';

@Component({
    selector: 'jhi-question-choice-detail',
    templateUrl: './question-choice-detail.component.html'
})
export class QuestionChoiceDetailComponent implements OnInit, OnDestroy {

    questionChoice: QuestionChoice;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: EventManager,
        private questionChoiceService: QuestionChoiceService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuestionChoices();
    }

    load(id) {
        this.questionChoiceService.find(id).subscribe((questionChoice) => {
            this.questionChoice = questionChoice;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionChoices() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionChoiceListModification',
            (response) => this.load(this.questionChoice.id)
        );
    }
}
