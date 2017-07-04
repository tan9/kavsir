import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager  } from 'ng-jhipster';

import { CategoryAcademicYear } from './category-academic-year.model';
import { CategoryAcademicYearService } from './category-academic-year.service';

@Component({
    selector: 'jhi-category-academic-year-detail',
    templateUrl: './category-academic-year-detail.component.html'
})
export class CategoryAcademicYearDetailComponent implements OnInit, OnDestroy {

    categoryAcademicYear: CategoryAcademicYear;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private categoryAcademicYearService: CategoryAcademicYearService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCategoryAcademicYears();
    }

    load(id) {
        this.categoryAcademicYearService.find(id).subscribe((categoryAcademicYear) => {
            this.categoryAcademicYear = categoryAcademicYear;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategoryAcademicYears() {
        this.eventSubscriber = this.eventManager.subscribe(
            'categoryAcademicYearListModification',
            (response) => this.load(this.categoryAcademicYear.id)
        );
    }
}
