import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { CategoryPublisher } from './category-publisher.model';
import { CategoryPublisherService } from './category-publisher.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-category-publisher',
    templateUrl: './category-publisher.component.html'
})
export class CategoryPublisherComponent implements OnInit, OnDestroy {
categoryPublishers: CategoryPublisher[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private categoryPublisherService: CategoryPublisherService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.categoryPublisherService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.categoryPublishers = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.categoryPublisherService.query().subscribe(
            (res: ResponseWrapper) => {
                this.categoryPublishers = res.json;
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
        this.registerChangeInCategoryPublishers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CategoryPublisher) {
        return item.id;
    }
    registerChangeInCategoryPublishers() {
        this.eventSubscriber = this.eventManager.subscribe('categoryPublisherListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
