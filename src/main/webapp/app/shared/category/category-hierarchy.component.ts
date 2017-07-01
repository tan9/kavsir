import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Category } from '../../entities/category.model';

import { ITreeOptions, TreeComponent, TreeNode } from 'angular-tree-component/dist/angular-tree-component';
import { CategoryNode, CategoryType } from '../../entities/category-node/category-node.model';
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

    private subscription;
    isTreeSaving = false;

    constructor(private categoryHierarchyService: CategoryHierarchyService,
                private alertService: JhiAlertService,
                private eventManager: JhiEventManager) {
    }

    ngOnInit() {
        this.subscription = this.eventManager.subscribe(
            'categoryNodeTreeModification',
            () => this.updateTree()
        );

        this.updateTree();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.subscription);
    }

    select(categoryNode: CategoryNode) {
        this.categoryHierarchyService.setWorkingCategory(categoryNode);
        this.updateTreeActivatedNode();
    }

    private updateTreeActivatedNode() {
        const category = this.categoryHierarchyService.getWorkingCategory();
        if (category) {
            const targetNode = this.tree.treeModel.getNodeBy((treeNode) => {
                return (treeNode.data) && (treeNode.data.id === category.id);
            });
            if (targetNode) {
                this.tree.treeModel.setActiveNode(targetNode, true, false);
            }
        }
    }

    public getSelected(): CategoryNode[] {
        const nodes = this.tree.treeModel.getActiveNodes();
        if (nodes.length === 1 && nodes[0].isRoot) {
            // return empty nodes if the selected node is ROOT
            return [];
        } else {
            return nodes.map((treeNode) => treeNode.data);
        }
    }

    updateTree() {
        this.treeNodes[0].children = this.categoryHierarchyService.getTree();
        this.tree.treeModel.update();
        this.updateTreeActivatedNode();
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
                this.eventManager.broadcast({
                    name: 'categoryNodeListModification',
                    content: 'Tree save OK'
                });
                this.isTreeSaving = false;
            },
            (error) => {
                this.isTreeSaving = false;
                this.onError(error);
                this.eventManager.broadcast({
                    name: 'categoryNodeListModification',
                    content: 'Tree save failed'
                });
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
