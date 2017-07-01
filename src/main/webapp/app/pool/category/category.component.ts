import { Component, Input, OnInit } from '@angular/core';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Category } from '../../entities/category.model';
import { CategoryService } from '../../entities/category.service';

@Component({
    selector: 'jhi-category',
    templateUrl: './category.component.html'
})
export class CategoryComponent implements OnInit {

    isSaving = false;

    @Input() items: Category[];

    /** type name in CapitalizedCamelcase. */
    @Input() typeName: string;
    @Input() service: CategoryService<Category>;

    constructor(private eventManager: JhiEventManager,
                private alertService: JhiAlertService) {
    }

    ngOnInit() {
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

        const eventName = 'category' + this.typeName + 'ListModification';
        Promise.all(promises).then(
            () => {
                this.eventManager.broadcast(eventName);
                this.isSaving = false;
            },
            (error) => {
                this.onError(error);
                this.eventManager.broadcast(eventName);
                this.isSaving = false;
            }
        );
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
