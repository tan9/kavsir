import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { CategorySemester } from './category-semester.model';
import { CategorySemesterService } from './category-semester.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-category-semester',
    templateUrl: './category-semester.component.html'
})
export class CategorySemesterComponent implements OnInit, OnDestroy {
categorySemesters: CategorySemester[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private categorySemesterService: CategorySemesterService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['categorySemester']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.categorySemesterService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.categorySemesters = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.categorySemesterService.query().subscribe(
            (res: Response) => {
                this.categorySemesters = res.json();
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
        this.registerChangeInCategorySemesters();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: CategorySemester) {
        return item.id;
    }



    registerChangeInCategorySemesters() {
        this.eventSubscriber = this.eventManager.subscribe('categorySemesterListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
