import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategoryPublisher } from './category-publisher.model';
import { CategoryPublisherService } from './category-publisher.service';
import { Principal } from '../../shared';

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
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.categoryPublisherService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<CategoryPublisher[]>) => this.categoryPublishers = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.categoryPublisherService.query().subscribe(
            (res: HttpResponse<CategoryPublisher[]>) => {
                this.categoryPublishers = res.body;
                this.currentSearch = '';
            },
            (res: HttpErrorResponse) => this.onError(res.message)
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
        this.jhiAlertService.error(error.message, null, null);
    }
}
