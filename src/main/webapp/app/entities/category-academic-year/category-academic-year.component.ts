import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { CategoryAcademicYear } from './category-academic-year.model';
import { CategoryAcademicYearService } from './category-academic-year.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-category-academic-year',
    templateUrl: './category-academic-year.component.html'
})
export class CategoryAcademicYearComponent implements OnInit, OnDestroy {
categoryAcademicYears: CategoryAcademicYear[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private categoryAcademicYearService: CategoryAcademicYearService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['categoryAcademicYear']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.categoryAcademicYearService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.categoryAcademicYears = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.categoryAcademicYearService.query().subscribe(
            (res: Response) => {
                this.categoryAcademicYears = res.json();
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
        this.registerChangeInCategoryAcademicYears();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: CategoryAcademicYear) {
        return item.id;
    }



    registerChangeInCategoryAcademicYears() {
        this.eventSubscriber = this.eventManager.subscribe('categoryAcademicYearListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
