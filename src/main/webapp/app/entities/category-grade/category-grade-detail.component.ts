import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CategoryGrade } from './category-grade.model';
import { CategoryGradeService } from './category-grade.service';

@Component({
    selector: 'jhi-category-grade-detail',
    templateUrl: './category-grade-detail.component.html'
})
export class CategoryGradeDetailComponent implements OnInit, OnDestroy {

    categoryGrade: CategoryGrade;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private categoryGradeService: CategoryGradeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCategoryGrades();
    }

    load(id) {
        this.categoryGradeService.find(id)
            .subscribe((categoryGradeResponse: HttpResponse<CategoryGrade>) => {
                this.categoryGrade = categoryGradeResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategoryGrades() {
        this.eventSubscriber = this.eventManager.subscribe(
            'categoryGradeListModification',
            (response) => this.load(this.categoryGrade.id)
        );
    }
}
