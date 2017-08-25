import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { CategorySource } from './category-source.model';
import { CategorySourceService } from './category-source.service';

@Component({
    selector: 'jhi-category-source-detail',
    templateUrl: './category-source-detail.component.html'
})
export class CategorySourceDetailComponent implements OnInit, OnDestroy {

    categorySource: CategorySource;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private categorySourceService: CategorySourceService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCategorySources();
    }

    load(id) {
        this.categorySourceService.find(id).subscribe((categorySource) => {
            this.categorySource = categorySource;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategorySources() {
        this.eventSubscriber = this.eventManager.subscribe(
            'categorySourceListModification',
            (response) => this.load(this.categorySource.id)
        );
    }
}
