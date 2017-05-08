import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { QuestionChoiceOption } from './question-choice-option.model';
import { QuestionChoiceOptionService } from './question-choice-option.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-question-choice-option',
    templateUrl: './question-choice-option.component.html'
})
export class QuestionChoiceOptionComponent implements OnInit, OnDestroy {
questionChoiceOptions: QuestionChoiceOption[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private questionChoiceOptionService: QuestionChoiceOptionService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['questionChoiceOption']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.questionChoiceOptionService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.questionChoiceOptions = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.questionChoiceOptionService.query().subscribe(
            (res: Response) => {
                this.questionChoiceOptions = res.json();
                this.currentSearch = '';
            },
            (res: Response) => this.onError(res.json())
        );
    }

    search (query) {
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
        this.registerChangeInQuestionChoiceOptions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: QuestionChoiceOption) {
        return item.id;
    }



    registerChangeInQuestionChoiceOptions() {
        this.eventSubscriber = this.eventManager.subscribe('questionChoiceOptionListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
