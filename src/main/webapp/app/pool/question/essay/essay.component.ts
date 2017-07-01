import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs/Subscription';
import { CategoryHierarchyService } from '../../../shared/category/category-hierarchy.service';

@Component({
    selector: 'jhi-essay',
    templateUrl: './essay.component.html',
    styleUrls: [ './essay.component.css' ]
})
export class EssayComponent implements OnInit, OnDestroy {

    private subscription: Subscription;

    constructor(public categoryHierarchyService: CategoryHierarchyService,
                private eventManager: JhiEventManager) {
    }

    ngOnInit(): void {
        this.subscription = this.eventManager.subscribe(
            'categorySelected',
            () => {
                setTimeout(() =>
                    this.eventManager.broadcast({ name: 'questionEssayListModification', content: 'Category Selected.'})
                );
            }
        );
    }

    ngOnDestroy(): void {
        this.eventManager.destroy(this.subscription);
    }
}
