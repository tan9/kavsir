import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiDataUtils } from 'ng-jhipster';

import { QuestionEssay } from './question-essay.model';
import { QuestionEssayService } from './question-essay.service';

@Component({
    selector: 'jhi-question-essay-detail',
    templateUrl: './question-essay-detail.component.html'
})
export class QuestionEssayDetailComponent implements OnInit, OnDestroy {

    questionEssay: QuestionEssay;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private dataUtils: JhiDataUtils,
        private questionEssayService: QuestionEssayService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuestionEssays();
    }

    load(id) {
        this.questionEssayService.find(id)
            .subscribe((questionEssayResponse: HttpResponse<QuestionEssay>) => {
                this.questionEssay = questionEssayResponse.body;
            });
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestionEssays() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionEssayListModification',
            (response) => this.load(this.questionEssay.id)
        );
    }
}
