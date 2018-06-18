import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CategorySubject } from './category-subject.model';
import { CategorySubjectService } from './category-subject.service';

@Component({
    selector: 'jhi-category-subject-detail',
    templateUrl: './category-subject-detail.component.html'
})
export class CategorySubjectDetailComponent implements OnInit, OnDestroy {

    categorySubject: CategorySubject;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private categorySubjectService: CategorySubjectService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCategorySubjects();
    }

    load(id) {
        this.categorySubjectService.find(id)
            .subscribe((categorySubjectResponse: HttpResponse<CategorySubject>) => {
                this.categorySubject = categorySubjectResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategorySubjects() {
        this.eventSubscriber = this.eventManager.subscribe(
            'categorySubjectListModification',
            (response) => this.load(this.categorySubject.id)
        );
    }
}
