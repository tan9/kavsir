import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager  } from 'ng-jhipster';

import { QuestionChoiceOption } from './question-choice-option.model';
import { QuestionChoiceOptionService } from './question-choice-option.service';

@Component({
    selector: 'jhi-question-choice-option-detail',
    templateUrl: './question-choice-option-detail.component.html'
})
export class QuestionChoiceOptionDetailComponent implements OnInit, OnDestroy {

    questionChoiceOption: QuestionChoiceOption;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: EventManager,
        private questionChoiceOptionService: QuestionChoiceOptionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuestionChoiceOptions();
    }

    load(id) {
        this.questionChoiceOptionService.find(id).subscribe((questionChoiceOption) => {
            this.questionChoiceOption = questionChoiceOption;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionChoiceOptions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionChoiceOptionListModification',
            (response) => this.load(this.questionChoiceOption.id)
        );
    }
}
