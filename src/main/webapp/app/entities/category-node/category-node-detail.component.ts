import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { CategoryNode } from './category-node.model';
import { CategoryNodeService } from './category-node.service';

@Component({
    selector: 'jhi-category-node-detail',
    templateUrl: './category-node-detail.component.html'
})
export class CategoryNodeDetailComponent implements OnInit, OnDestroy {

    categoryNode: CategoryNode;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private categoryNodeService: CategoryNodeService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInCategoryNodes();
    }

    load(id) {
        this.categoryNodeService.find(id)
            .subscribe((categoryNodeResponse: HttpResponse<CategoryNode>) => {
                this.categoryNode = categoryNodeResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategoryNodes() {
        this.eventSubscriber = this.eventManager.subscribe(
            'categoryNodeListModification',
            (response) => this.load(this.categoryNode.id)
        );
    }
}
