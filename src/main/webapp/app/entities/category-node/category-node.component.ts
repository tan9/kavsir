import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { CategoryNode } from './category-node.model';
import { CategoryNodeService } from './category-node.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-category-node',
    templateUrl: './category-node.component.html'
})
export class CategoryNodeComponent implements OnInit, OnDestroy {
categoryNodes: CategoryNode[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private categoryNodeService: CategoryNodeService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.categoryNodeService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.categoryNodes = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.categoryNodeService.query().subscribe(
            (res: ResponseWrapper) => {
                this.categoryNodes = res.json;
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
        this.registerChangeInCategoryNodes();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CategoryNode) {
        return item.id;
    }
    registerChangeInCategoryNodes() {
        this.eventSubscriber = this.eventManager.subscribe('categoryNodeListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
