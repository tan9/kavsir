import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { ResponseWrapper } from '../model/response-wrapper.model';
import { JhiAlertService } from 'ng-jhipster';
import { CategoryNodeService } from '../../entities/category-node/category-node.service';
import { Category } from '../../entities/category.model';

import { ITreeOptions, TreeComponent, TreeNode } from 'angular-tree-component/dist/angular-tree-component';
import { CategoryType } from '../../entities/category-node/category-node.model';
import { CategoryHierarchyService, CategoryTreeNode } from './category-hierarchy.service';

@Component({
    selector: 'jhi-category-hierarchy',
    templateUrl: './category-hierarchy.component.html',
    styleUrls: ['./category-hierarchy.component.css']
})
export class CategoryHierarchyComponent implements OnInit, OnDestroy {

    @Input() editable = false;

    @ViewChild(TreeComponent) tree: TreeComponent;

    treeNodes: CategoryTreeNode[] = [{
        treeNodeId: -1,
        isExpanded: true,
        children: []
    }];

    treeOptions: ITreeOptions = {
        idField: 'treeNodeId',
        isHiddenField: 'isMarkedToBeDeleted',
        allowDrag: false,
        allowDrop: false
    };

    isTreeSaving = false;

    constructor(private categoryHierarchyService: CategoryHierarchyService,
                private alertService: JhiAlertService,
                private categoryNodeService: CategoryNodeService) {
    }

    ngOnInit() {
        this.loadAllCategoryNodes();
    }

    ngOnDestroy() {
    }

    loadAllCategoryNodes() {
        this.categoryNodeService.query({'page': 0, 'size': 50000}).subscribe(
            (res: ResponseWrapper) => {
                const nodes = res.json;
                // TODO enum order/literal conversion?
                nodes.forEach((item) => item.type = CategoryType[item.type]);

                const children = this.categoryHierarchyService.constructTreeRecursively(nodes);
                this.treeNodes[0].children = children;
                this.tree.treeModel.update();
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    addCategoryChild(node: TreeNode, item: Category) {
        this.addChild(node, {
            type: this.categoryHierarchyService.categoryLevelData(node.level).type,
            typeId: item.id
        });
    }

    addSegmentChild(node: TreeNode) {
        this.addChild(node, {
            name: '',
            type: CategoryType.SEGMENT,
            isEditing: true
        });
    }

    private addChild(node: TreeNode, child: any) {
        const nodeData = node.data;
        if (!nodeData.hasOwnProperty('children')) {
            nodeData.children = [];
        }

        nodeData.children.push(child);
        node.treeModel.update();

        if (!node.isExpanded) {
            node.treeModel.setExpandedNode(node, true);
        }
    }

    isItemExisted(children: TreeNode[], item: Category): boolean {
        return children.some((child) => child.data.typeId === item.id);
    }

    childrenCount(node: TreeNode): number {
        return node && node.children ? node.children.length : 0;
    }

    saveTree() {
        // TODO PERFORMANCE move to backend and perform batch update
        this.isTreeSaving = true;
        const treeNodes = this.treeNodes[0].children;
        this.categoryHierarchyService.saveTreeRecursively(treeNodes).then(
            () => {
                this.loadAllCategoryNodes();
                this.isTreeSaving = false;
            },
            (error) => {
                this.isTreeSaving = false;
                this.onError(error);
                this.loadAllCategoryNodes();
            }
        );
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    filterNodes(text: string, tree: TreeComponent) {
        tree.treeModel.filterNodes((node) => {
            return this.categoryHierarchyService.nodeDisplayName(node).toLowerCase().indexOf(text.toLowerCase()) !== -1;
        });
    }

    categoryLevelName(level: number) {
        return this.categoryHierarchyService.categoryLevelName(level);
    }

    nodeDisplayName(node: TreeNode) {
        return this.categoryHierarchyService.nodeDisplayName(node);
    }

    availableCategoryChildren(level: number): Category[] {
        return this.categoryHierarchyService.availableCategoryChildren(level);
    }

    collapseAll() {
        this.tree.treeModel.collapseAll();
    }

    expandAll() {
        this.tree.treeModel.expandAll();
    }
}
