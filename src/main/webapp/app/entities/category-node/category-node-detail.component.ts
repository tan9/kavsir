import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';
import { CategoryNode } from './category-node.model';
import { CategoryNodeService } from './category-node.service';

@Component({
    selector: 'jhi-category-node-detail',
    templateUrl: './category-node-detail.component.html'
})
export class CategoryNodeDetailComponent implements OnInit, OnDestroy {

    categoryNode: CategoryNode;
    private subscription: any;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private categoryNodeService: CategoryNodeService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.setLocations(['categoryNode', 'categoryType']);
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe(params => {
            this.load(params['id']);
        });
    }

    load (id) {
        this.categoryNodeService.find(id).subscribe(categoryNode => {
            this.categoryNode = categoryNode;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
