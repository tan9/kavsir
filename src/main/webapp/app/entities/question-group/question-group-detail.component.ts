import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager  } from 'ng-jhipster';

import { QuestionGroup } from './question-group.model';
import { QuestionGroupService } from './question-group.service';

@Component({
    selector: 'jhi-question-group-detail',
    templateUrl: './question-group-detail.component.html'
})
export class QuestionGroupDetailComponent implements OnInit, OnDestroy {

    questionGroup: QuestionGroup;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: EventManager,
        private questionGroupService: QuestionGroupService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuestionGroups();
    }

    load(id) {
        this.questionGroupService.find(id).subscribe((questionGroup) => {
            this.questionGroup = questionGroup;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionGroups() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionGroupListModification',
            (response) => this.load(this.questionGroup.id)
        );
    }
}
