import { Component, OnInit, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { CategoryGrade } from './category-grade.model';
import { CategoryGradeService } from './category-grade.service';
import { ITEMS_PER_PAGE, Principal } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-category-grade',
    templateUrl: './category-grade.component.html'
})
export class CategoryGradeComponent implements OnInit, OnDestroy {
categoryGrades: CategoryGrade[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private categoryGradeService: CategoryGradeService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
        this.jhiLanguageService.setLocations(['categoryGrade']);
    }

    loadAll() {
        if (this.currentSearch) {
            this.categoryGradeService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: Response) => this.categoryGrades = res.json(),
                    (res: Response) => this.onError(res.json())
                );
            return;
       }
        this.categoryGradeService.query().subscribe(
            (res: Response) => {
                this.categoryGrades = res.json();
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
        this.registerChangeInCategoryGrades();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId (index: number, item: CategoryGrade) {
        return item.id;
    }



    registerChangeInCategoryGrades() {
        this.eventSubscriber = this.eventManager.subscribe('categoryGradeListModification', (response) => this.loadAll());
    }


    private onError (error) {
        this.alertService.error(error.message, null, null);
    }
}
