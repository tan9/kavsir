import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { QuestionTrueFalse } from './question-true-false.model';
import { QuestionTrueFalseService } from './question-true-false.service';

@Component({
    selector: 'jhi-question-true-false-detail',
    templateUrl: './question-true-false-detail.component.html'
})
export class QuestionTrueFalseDetailComponent implements OnInit, OnDestroy {

    questionTrueFalse: QuestionTrueFalse;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private questionTrueFalseService: QuestionTrueFalseService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['questionTrueFalse']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.questionTrueFalseService.find(id).subscribe(questionTrueFalse => {
            this.questionTrueFalse = questionTrueFalse;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
