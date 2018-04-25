import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategoryAcademicYear } from './category-academic-year.model';
import { CategoryAcademicYearService } from './category-academic-year.service';
import { Principal } from '../../shared';

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
        private categoryAcademicYearService: CategoryAcademicYearService,
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
            this.categoryAcademicYearService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<CategoryAcademicYear[]>) => this.categoryAcademicYears = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.categoryAcademicYearService.query().subscribe(
            (res: HttpResponse<CategoryAcademicYear[]>) => {
                this.categoryAcademicYears = res.body;
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
        this.registerChangeInCategoryAcademicYears();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CategoryAcademicYear) {
        return item.id;
    }
    registerChangeInCategoryAcademicYears() {
        this.eventSubscriber = this.eventManager.subscribe('categoryAcademicYearListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
