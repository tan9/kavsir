import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategorySemester } from './category-semester.model';
import { CategorySemesterService } from './category-semester.service';
import { Principal } from '../../shared';

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
        private categorySemesterService: CategorySemesterService,
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
            this.categorySemesterService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<CategorySemester[]>) => this.categorySemesters = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.categorySemesterService.query().subscribe(
            (res: HttpResponse<CategorySemester[]>) => {
                this.categorySemesters = res.body;
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
        this.registerChangeInCategorySemesters();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CategorySemester) {
        return item.id;
    }
    registerChangeInCategorySemesters() {
        this.eventSubscriber = this.eventManager.subscribe('categorySemesterListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
