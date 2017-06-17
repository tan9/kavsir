import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { QuestionGroup } from './question-group.model';
import { QuestionGroupService } from './question-group.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-question-group',
    templateUrl: './question-group.component.html'
})
export class QuestionGroupComponent implements OnInit, OnDestroy {
questionGroups: QuestionGroup[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private questionGroupService: QuestionGroupService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.questionGroupService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.questionGroups = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.questionGroupService.query().subscribe(
            (res: ResponseWrapper) => {
                this.questionGroups = res.json;
                this.currentSearch = '';
            },
            (res: ResponseWrapper) => this.onError(res.json)
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
        this.registerChangeInQuestionGroups();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: QuestionGroup) {
        return item.id;
    }
    registerChangeInQuestionGroups() {
        this.eventSubscriber = this.eventManager.subscribe('questionGroupListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
