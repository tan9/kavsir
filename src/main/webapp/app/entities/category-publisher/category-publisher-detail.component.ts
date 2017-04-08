import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager , JhiLanguageService  } from 'ng-jhipster';

import { CategoryPublisher } from './category-publisher.model';
import { CategoryPublisherService } from './category-publisher.service';

@Component({
    selector: 'jhi-category-publisher-detail',
    templateUrl: './category-publisher-detail.component.html'
})
export class CategoryPublisherDetailComponent implements OnInit, OnDestroy {

    categoryPublisher: CategoryPublisher;
    private subscription: any;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: EventManager,
        private jhiLanguageService: JhiLanguageService,
        private categoryPublisherService: CategoryPublisherService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['categoryPublisher']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
        this.registerChangeInCategoryPublishers();
    }

    load (id) {
        this.categoryPublisherService.find(id).subscribe(categoryPublisher => {
            this.categoryPublisher = categoryPublisher;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategoryPublishers() {
        this.eventSubscriber = this.eventManager.subscribe('categoryPublisherListModification', response => this.load(this.categoryPublisher.id));
    }

}
