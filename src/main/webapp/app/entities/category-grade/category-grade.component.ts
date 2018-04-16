import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { CategoryGrade } from './category-grade.model';
import { CategoryGradeService } from './category-grade.service';
import { Principal } from '../../shared';

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
        private categoryGradeService: CategoryGradeService,
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
            this.categoryGradeService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: HttpResponse<CategoryGrade[]>) => this.categoryGrades = res.body,
                    (res: HttpErrorResponse) => this.onError(res.message)
                );
            return;
       }
        this.categoryGradeService.query().subscribe(
            (res: HttpResponse<CategoryGrade[]>) => {
                this.categoryGrades = res.body;
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
        this.registerChangeInCategoryGrades();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CategoryGrade) {
        return item.id;
    }
    registerChangeInCategoryGrades() {
        this.eventSubscriber = this.eventManager.subscribe('categoryGradeListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
