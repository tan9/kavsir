import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { QuestionEssay } from './question-essay.model';
import { QuestionEssayService } from './question-essay.service';

@Component({
    selector: 'jhi-question-essay-detail',
    templateUrl: './question-essay-detail.component.html'
})
export class QuestionEssayDetailComponent implements OnInit, OnDestroy {

    questionEssay: QuestionEssay;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private questionEssayService: QuestionEssayService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['questionEssay']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.questionEssayService.find(id).subscribe(questionEssay => {
            this.questionEssay = questionEssay;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
