import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs/Subscription';
import { CategoryHierarchyService } from '../../../shared/category/category-hierarchy.service';
import { CategoryNode } from '../../../entities/category-node/category-node.model';

@Component({
    selector: 'jhi-true-false',
    templateUrl: './true-false.component.html',
    styleUrls: [ './true-false.component.css' ]
})
export class TrueFalseComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    categories: CategoryNode[] = [];

    constructor(public categoryHierarchyService: CategoryHierarchyService,
                private eventManager: JhiEventManager) {
    }

    ngOnInit(): void {
        this.subscription = this.eventManager.subscribe(
            'categoriesSelected',
            (categories) => {
                this.categories = categories.content;
                setTimeout(() =>
                    this.eventManager.broadcast({ name: 'questionTrueFalseListModification', content: 'Category Selected.'})
                );
            }
        );
    }

    ngOnDestroy(): void {
        this.eventManager.destroy(this.subscription);
    }
}
