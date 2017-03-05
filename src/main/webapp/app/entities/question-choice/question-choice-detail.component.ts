import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { QuestionChoice } from './question-choice.model';
import { QuestionChoiceService } from './question-choice.service';

@Component({
    selector: 'jhi-question-choice-detail',
    templateUrl: './question-choice-detail.component.html'
})
export class QuestionChoiceDetailComponent implements OnInit, OnDestroy {

    questionChoice: QuestionChoice;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private questionChoiceService: QuestionChoiceService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['questionChoice']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.questionChoiceService.find(id).subscribe(questionChoice => {
            this.questionChoice = questionChoice;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
