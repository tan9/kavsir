import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { QuestionChoice } from './question-choice.model';
import { QuestionChoiceService } from './question-choice.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-question-choice',
    templateUrl: './question-choice.component.html'
})
export class QuestionChoiceComponent implements OnInit, OnDestroy {
questionChoices: QuestionChoice[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private questionChoiceService: QuestionChoiceService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.questionChoiceService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.questionChoices = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.questionChoiceService.query().subscribe(
            (res: Response) => {
                this.questionChoices = res.json();
                this.currentSearch = '';
            },
            (res: Response) => this.onError(res.json())
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInQuestionChoices();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: QuestionChoice) {
        return item.id;
    }
    registerChangeInQuestionChoices() {
        this.eventSubscriber = this.eventManager.subscribe('questionChoiceListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
