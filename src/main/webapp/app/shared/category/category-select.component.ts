import { Component, ViewChild } from '@angular/core';
import { CategoryHierarchyComponent } from './category-hierarchy.component';
import { CategoryNode } from '../../entities/category-node/category-node.model';

@Component({
    selector: 'jhi-category-select',
    templateUrl: './category-select.component.html'
})
export class CategorySelectComponent {

    selectSubCategories = true;

    @ViewChild(CategoryHierarchyComponent) hierarchy: CategoryHierarchyComponent;

    public getSelected(): CategoryNode[] {
        const nodes = this.hierarchy.tree.treeModel.getActiveNodes();
        console.log(nodes);
        return nodes;
    }
}
