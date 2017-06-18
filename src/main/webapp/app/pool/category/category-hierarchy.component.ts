import { Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { ResponseWrapper } from '../../shared/model/response-wrapper.model';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { CategoryAcademicYear } from '../../entities/category-academic-year';
import { CategoryGrade } from '../../entities/category-grade';
import { CategorySemester } from '../../entities/category-semester';
import { CategorySubject } from '../../entities/category-subject';
import { CategoryPublisher } from '../../entities/category-publisher';
import { CategoryNodeService } from '../../entities/category-node/category-node.service';
import { Category } from '../../entities/category.model';

import { ITreeOptions, TreeComponent, TreeNode } from 'angular-tree-component/dist/angular-tree-component';
import { CategoryNode, CategoryType } from '../../entities/category-node/category-node.model';

@Component({
    selector: 'jhi-category-hierarchy',
    templateUrl: './category-hierarchy.component.html',
    styleUrls: ['./category-hierarchy.component.css']
})
export class CategoryHierarchyComponent implements OnInit, OnDestroy {

    private CATEGORY_LEVEL_MAP = {
        1: {type: CategoryType.ACADEMIC_YEAR, name: '學年'},
        2: {type: CategoryType.GRADE, name: '年級'},
        3: {type: CategoryType.SEMESTER, name: '學期'},
        4: {type: CategoryType.SUBJECT, name: '科目'},
        5: {type: CategoryType.PUBLISHER, name: '出版社'},
        6: {type: CategoryType.SEGMENT, name: '子類別'}
    };

    @Input() categoryAcademicYears: CategoryAcademicYear[];
    @Input() categoryGrades: CategoryGrade[];
    @Input() categorySemesters: CategorySemester[];
    @Input() categorySubjects: CategorySubject[];
    @Input() categoryPublishers: CategoryPublisher[];

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

    constructor(private eventManager: JhiEventManager,
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

                const children = this.constructTreeRecursively(nodes);
                this.treeNodes[0].children = children;
                this.tree.treeModel.update();
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    private constructTreeRecursively(nodes: CategoryNode[], parentId?: number): CategoryTreeNode[] {
        const childrenOfTheParent = [];
        const elementsSelected: number[] = [];
        nodes.forEach((node, index) => {
            const isTopLevelNode = (!parentId && !node.parent);
            const isChildOfTheParent = (parentId && node.parent && node.parent.id === parentId);
            if (isTopLevelNode || isChildOfTheParent) {
                childrenOfTheParent.push(node);
                elementsSelected.push(index);
            }
        });

        elementsSelected.reverse().forEach((index) => {
           nodes.splice(index, 1);
        });

        if (nodes.length > 0) {
            childrenOfTheParent.forEach((node) => {
                node.children = this.constructTreeRecursively(nodes, node.id);
            });
        }

        return childrenOfTheParent;
    }

    categoryLevelName(level: number) {
        return this.categoryLevelData(level).name;
    }

    categoryLevelData(level: number) {
        return this.CATEGORY_LEVEL_MAP[level];
    }

    nodeDisplayName(node: TreeNode) {
        if (node.level === 1) {
            return '類別目錄';

        } else if (node.level > 1 && node.level <= 6) {
            return this.categoryNodeDisplayName(node.data);

        } else {
            return node.data.name;
        }
    }

    private categoryNodeDisplayName(node: CategoryTreeNode) {
        return this.availableCategories(node.type)
            .find((item) => item.id === node.typeId)
            .name;
    }

    availableCategories(type: CategoryType): Category[] {
        switch (type) {
            case CategoryType.ACADEMIC_YEAR:
                return this.categoryAcademicYears;
            case CategoryType.GRADE:
                return this.categoryGrades;
            case CategoryType.SEMESTER:
                return this.categorySemesters;
            case CategoryType.SUBJECT:
                return this.categorySubjects;
            case CategoryType.PUBLISHER:
                return this.categoryPublishers;
        }
    }

    availableCategoryChildren(level: number): Category[] {
        return {
                1: this.categoryAcademicYears,
                2: this.categoryGrades,
                3: this.categorySemesters,
                4: this.categorySubjects,
                5: this.categoryPublishers
            }[level] || [];
    }

    addCategoryChild(node: TreeNode, item: Category) {
        this.addChild(node, {
            type: this.categoryLevelData(node.level).type,
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
        this.saveTreeRecursively(treeNodes).then(
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

    private saveTreeRecursively(treeNodes: CategoryTreeNode[], parent?: CategoryTreeNode): Promise<CategoryNode> {
        // TODO Observable?
        const promises: Promise<CategoryNode>[] = [];

        treeNodes.forEach(
            (node) => {
                node.parent = this.convert(parent);
                if (node.id) {
                    // already persisted node, update content
                    promises.push(this.categoryNodeService.update(this.convert(node)).toPromise().then(() => {
                        if (node.children) {
                            return this.saveTreeRecursively(node.children, node);
                        } else {
                            return Promise.resolve<CategoryNode>(null);
                        }
                    }));
                } else {
                    // newly created node, save it first
                    promises.push(this.categoryNodeService.create(this.convert(node)).toPromise().then((resultNode) => {
                            node.id = resultNode.id;
                            if (node.children) {
                                return this.saveTreeRecursively(node.children, node);
                            } else {
                                return Promise.resolve<CategoryNode>(null);
                            }
                        })
                    );
                }
            }
        );

        return Promise.all(promises);
    }

    private convert(categoryNode: CategoryNode): CategoryNode {
        if (categoryNode === undefined) {
            return undefined;
        }

        const copy: CategoryNode = Object.assign({}, categoryNode);
        copy['children'] = undefined;
        return copy;
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    filterNodes(text: string, tree: TreeComponent) {
        tree.treeModel.filterNodes((node) => {
            return this.nodeDisplayName(node).toLowerCase().indexOf(text.toLowerCase()) !== -1;
        });
    }
}

class CategoryTreeNode extends CategoryNode {
    constructor(public id?: number,
                public type?: CategoryType,
                public typeId?: number,
                public name?: string,
                public position?: number,
                public treeNodeId?: number,
                public children?: CategoryTreeNode[],
                public isMarkedToBeDeleted?: boolean,
                public isExpanded?: boolean) {
        super(id, type, typeId, name, position);
    }
}
