import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { QuestionChoiceOption } from './question-choice-option.model';
import { QuestionChoiceOptionService } from './question-choice-option.service';

@Component({
    selector: 'jhi-question-choice-option-detail',
    templateUrl: './question-choice-option-detail.component.html'
})
export class QuestionChoiceOptionDetailComponent implements OnInit, OnDestroy {

    questionChoiceOption: QuestionChoiceOption;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private questionChoiceOptionService: QuestionChoiceOptionService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['questionChoiceOption']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.questionChoiceOptionService.find(id).subscribe(questionChoiceOption => {
            this.questionChoiceOption = questionChoiceOption;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
