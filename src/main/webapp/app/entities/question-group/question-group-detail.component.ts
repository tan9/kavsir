import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { QuestionGroup } from './question-group.model';
import { QuestionGroupService } from './question-group.service';

@Component({
    selector: 'jhi-question-group-detail',
    templateUrl: './question-group-detail.component.html'
})
export class QuestionGroupDetailComponent implements OnInit, OnDestroy {

    questionGroup: QuestionGroup;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private questionGroupService: QuestionGroupService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['questionGroup']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.questionGroupService.find(id).subscribe(questionGroup => {
            this.questionGroup = questionGroup;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
