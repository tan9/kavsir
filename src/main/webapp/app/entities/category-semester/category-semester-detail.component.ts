import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CategorySemester } from './category-semester.model';
import { CategorySemesterService } from './category-semester.service';

@Component({
    selector: 'jhi-category-semester-detail',
    templateUrl: './category-semester-detail.component.html'
})
export class CategorySemesterDetailComponent implements OnInit, OnDestroy {

    categorySemester: CategorySemester;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private categorySemesterService: CategorySemesterService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCategorySemesters();
    }

    load(id) {
        this.categorySemesterService.find(id)
            .subscribe((categorySemesterResponse: HttpResponse<CategorySemester>) => {
                this.categorySemester = categorySemesterResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategorySemesters() {
        this.eventSubscriber = this.eventManager.subscribe(
            'categorySemesterListModification',
            (response) => this.load(this.categorySemester.id)
        );
    }
}
