import { Component, OnDestroy, OnInit } from '@angular/core';
import { TreeNode } from 'angular-tree-component';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs/Subscription';
import { CategoryHierarchyService } from '../../../shared/category/category-hierarchy.service';

@Component({
    selector: 'jhi-true-false',
    templateUrl: './true-false.component.html',
    styleUrls: [ './true-false.component.css' ]
})
export class TrueFalseComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    categories: TreeNode[] = [];

    constructor(public categoryHierarchyService: CategoryHierarchyService,
                private eventManager: JhiEventManager) {
    }

    ngOnInit(): void {
        this.subscription = this.eventManager.subscribe(
            'categoriesSelected',
            (categories) => {
                this.categories = categories.content;
            }
        );
    }

    ngOnDestroy(): void {
        this.eventManager.destroy(this.subscription);
    }
}
