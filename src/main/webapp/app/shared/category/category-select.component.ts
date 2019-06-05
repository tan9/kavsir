import { Component, ViewChild } from '@angular/core';
import { CategoryHierarchyComponent } from './category-hierarchy.component';
import { ICategoryNode } from 'app/shared/model/category-node.model';

@Component({
  selector: 'jhi-category-select',
  templateUrl: './category-select.component.html'
})
export class CategorySelectComponent {
  selectSubCategories = true;

  @ViewChild(CategoryHierarchyComponent) hierarchy: CategoryHierarchyComponent;

  public getSelected(): ICategoryNode[] {
    const nodes = this.hierarchy.tree.treeModel.getActiveNodes();
    return nodes;
  }
}
