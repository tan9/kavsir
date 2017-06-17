import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ResponseWrapper } from '../../shared/model/response-wrapper.model';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Subscription } from 'rxjs/Rx';
import { Category } from '../../entities/category.model';
import { CategoryService } from '../../entities/category.service';

@Component({
    selector: 'jhi-category',
    templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit, OnDestroy {

    eventSubscriber: Subscription;

    isSaving = false;

    @Input() items: Category[];

    /** type name in CapitalizedCamelcase. */
    @Input() typeName: string;
    @Input() service: CategoryService<Category>;

    constructor(private eventManager: JhiEventManager,
                private alertService: JhiAlertService) {
    }

    loadAllCategoryItems() {
        this.service.query().subscribe(
            (res: ResponseWrapper) => {
                this.items.length = 0;
                const newItems = res.json.sort(
                    (a: Category, b: Category) => {
                        const position = a.position - b.position;
                        return position !== 0 ? position : a.id - b.id;
                    });
                Array.prototype.push.apply(this.items, newItems);
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    ngOnInit() {
        this.loadAllCategoryItems();

        this.registerChangeInCategoryItems();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInCategoryItems() {
        const eventName = 'category' + this.typeName + 'ListModification';
        this.eventSubscriber = this.eventManager.subscribe(
            eventName, (response) => this.loadAllCategoryItems());
    }

    hyphenSeparatedTypeName() {
        return this.typeName.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`).substring(1);
    }

    move(index: number, direction: string) {
        this.isSaving = true;
        const target = index + ((direction === 'UP') ? -1 : 1);

        const tmp = this.items[index];
        this.items[index] = this.items[target];
        this.items[target] = tmp;

        // TODO Observable?
        const promises: Promise<Category>[] = [];
        this.items.forEach((item, i) => {
            if (item.position !== i) {
                item.position = i;
                promises.push(this.service.update(item).toPromise());
            }
        });

        Promise.all(promises).then(
            () => {
                this.loadAllCategoryItems();
                this.isSaving = false;
            },
            (error) => {
                this.onError(error);
                this.loadAllCategoryItems();
                this.isSaving = false;
            }
        );
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
