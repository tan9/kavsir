import { Injectable, OnInit } from '@angular/core';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { CategoryNodeService } from '../../entities/category-node/category-node.service';
import { Category } from '../../entities/category.model';

import { TreeNode } from 'angular-tree-component/dist/angular-tree-component';
import { CategoryNode, CategoryType } from '../../entities/category-node/category-node.model';
import { CategoriesService } from './categories.service';
import { ResponseWrapper } from '../model/response-wrapper.model';

@Injectable()
export class CategoryHierarchyService implements OnInit {

    private CATEGORY_LEVEL_MAP = {
        1: {type: CategoryType.ACADEMIC_YEAR, name: '學年'},
        2: {type: CategoryType.GRADE, name: '年級'},
        3: {type: CategoryType.SEMESTER, name: '學期'},
        4: {type: CategoryType.SUBJECT, name: '科目'},
        5: {type: CategoryType.PUBLISHER, name: '出版社'},
        6: {type: CategoryType.SEGMENT, name: '子類別'}
    };

    private subscription;

    nodeMap: Map<number, CategoryNode> = new Map();
    private nodes: CategoryNode[] = [];
    tree: CategoryTreeNode[] = [];

    constructor(private categoriesService: CategoriesService,
                private categoryNodeService: CategoryNodeService,
                private eventManager: JhiEventManager,
                private alertService: JhiAlertService) {

        // Service is not lifecycle-managed, we have to init it by ourselves.
        // https://stackoverflow.com/a/35110798/3440376
        this.ngOnInit();
    }

    ngOnInit() {
        this.subscription = this.eventManager.subscribe(
            'categoryNodeListModification',
            () => this.loadAllCategoryNodes()
        );
        this.loadAllCategoryNodes();
    }

    getTree(): CategoryTreeNode[] {
        return this.tree;
    }

    getNodes(): CategoryNode[] {
        return this.nodes;
    }

    private loadAllCategoryNodes() {
        this.categoryNodeService.query({'page': 0, 'size': 10240}).subscribe(
            (res: ResponseWrapper) => {
                const nodes = res.json;

                this.nodes.length = 0;
                Array.prototype.push.apply(this.nodes, nodes);

                // TODO enum order/literal conversion?
                nodes.forEach((item) => {
                    item.type = CategoryType[item.type];
                    this.nodeMap.set(item.id, item);
                });

                const children = this.constructTreeRecursively(nodes);
                this.tree = children;

                this.eventManager.broadcast({
                    name: 'categoryNodeTreeModification',
                    content: 'OK'
                });
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

    pathDisplayName(node: TreeNode | number): string {
        const displayNames: string[] = [];
        if (typeof node === 'number') {
            // categoryNode.id
            let categoryNode = this.nodeMap.get(node);
            if (categoryNode !== undefined) {
                while (categoryNode) {
                    displayNames.unshift(
                        this.categoryNodeDisplayName(categoryNode)
                    );
                    if (categoryNode.parent) {
                        categoryNode = this.nodeMap.get(categoryNode.parent.id);
                    } else {
                        break;
                    }
                }

            } else {
                return 'UNKNOWN NODE: ' + node;
            }

        } else {
            // tree node
            while (node && node.level > 1) {
                displayNames.unshift(this.nodeDisplayName(node));
                node = node.parent;
            }
        }

        return displayNames.join(' / ');
    }

    nodeDisplayName(node: TreeNode): string {
        if (!node) {
            return '...';

        } else if (node.level === 1) {
            return '總類別';

        } else if (node.level > 1 && node.level <= 6) {
            return this.categoryNodeDisplayName(node.data);

        } else {
            return node.data.name;
        }
    }

    private categoryNodeDisplayName(node: CategoryNode) {
        if (node.name) {
            return node.name;
        }
        const category = this.availableCategories(node.type).find(
            (item) => item.id === node.typeId);
        return category ? category.name : 'loading...';
    }

    availableCategories(type: CategoryType): Category[] {
        switch (type) {
            case CategoryType.ACADEMIC_YEAR:
                return this.categoriesService.academicYears;
            case CategoryType.GRADE:
                return this.categoriesService.grades;
            case CategoryType.SEMESTER:
                return this.categoriesService.semesters;
            case CategoryType.SUBJECT:
                return this.categoriesService.subjects;
            case CategoryType.PUBLISHER:
                return this.categoriesService.publishers;
        }
    }

    availableCategoryChildren(level: number): Category[] {
        return {
                1: this.categoriesService.academicYears,
                2: this.categoriesService.grades,
                3: this.categoriesService.semesters,
                4: this.categoriesService.subjects,
                5: this.categoriesService.publishers
            }[level] || [];
    }

    saveTreeRecursively(treeNodes: CategoryTreeNode[], parent?: CategoryTreeNode): Promise<CategoryNode> {
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
}

export class CategoryTreeNode extends CategoryNode {
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
