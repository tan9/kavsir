import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
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
        this.categorySemesterService.find(id).subscribe((categorySemester) => {
            this.categorySemester = categorySemester;
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
