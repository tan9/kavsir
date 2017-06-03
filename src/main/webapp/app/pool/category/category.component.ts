import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResponseWrapper } from '../../shared/model/response-wrapper.model';
import { EventManager, AlertService } from 'ng-jhipster';
import { CategoryAcademicYear, CategoryAcademicYearService } from '../../entities/category-academic-year';
import { CategoryGrade, CategoryGradeService } from '../../entities/category-grade';
import { CategorySemester, CategorySemesterService } from '../../entities/category-semester';
import { CategorySubject, CategorySubjectService } from '../../entities/category-subject';
import { CategoryPublisher, CategoryPublisherService } from '../../entities/category-publisher';
import { Category } from '../../entities/category.model';

import { Subscription } from 'rxjs/Rx';
import { ITreeOptions, TreeNode } from 'angular-tree-component/dist/angular-tree-component';

@Component({
    selector: 'jhi-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {

    categoryAcademicYearsEventSubscriber: Subscription;
    categoryGradesEventSubscriber: Subscription;
    categorySemestersEventSubscriber: Subscription;
    categorySubjectsEventSubscriber: Subscription;
    categoryPublishersEventSubscriber: Subscription;

    categoryAcademicYears: CategoryAcademicYear[];
    categoryGrades: CategoryGrade[];
    categorySemesters: CategorySemester[];
    categorySubjects: CategorySubject[];
    categoryPublishers: CategorySubject[];

    nodes = [{
        id: 'ROOT',
        name: '類別目錄'
    }];

    options: ITreeOptions = {
        allowDrag: (node) => false,
        allowDrop: (element, {parent, index}) => false
    };

    constructor(private eventManager: EventManager,
                private alertService: AlertService,
                private categoryAcademicYearService: CategoryAcademicYearService,
                private categoryGradeService: CategoryGradeService,
                private categorySemesterService: CategorySemesterService,
                private categorySubjectService: CategorySubjectService,
                private categoryPublisherService: CategoryPublisherService) {
    }

    loadAllCategoryAcademicYears() {
        this.categoryAcademicYearService.query().subscribe(
            (res: ResponseWrapper) => {
                this.categoryAcademicYears = res.json.sort(
                    (a: CategoryAcademicYear, b: CategoryAcademicYear) => {
                        const position = a.position - b.position;
                        return position !== 0 ? position : a.id - b.id;
                    });
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    loadAllCategoryGrades() {
        this.categoryGradeService.query().subscribe(
            (res: ResponseWrapper) => {
                this.categoryGrades = res.json.sort(
                    (a: CategoryGrade, b: CategoryGrade) => {
                        const position = a.position - b.position;
                        return position !== 0 ? position : a.id - b.id;
                    });
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    loadAllCategorySemesters() {
        this.categorySemesterService.query().subscribe(
            (res: ResponseWrapper) => {
                this.categorySemesters = res.json.sort(
                    (a: CategorySemester, b: CategorySemester) => {
                        const position = a.position - b.position;
                        return position !== 0 ? position : a.id - b.id;
                    });
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    loadAllCategorySubjects() {
        this.categorySubjectService.query().subscribe(
            (res: ResponseWrapper) => {
                this.categorySubjects = res.json.sort(
                    (a: CategorySubject, b: CategorySubject) => {
                        const position = a.position - b.position;
                        return position !== 0 ? position : a.id - b.id;
                    });
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    loadAllCategoryPublishers() {
        this.categoryPublisherService.query().subscribe(
            (res: ResponseWrapper) => {
                this.categoryPublishers = res.json.sort(
                    (a: CategoryPublisher, b: CategoryPublisher) => {
                        const position = a.position - b.position;
                        return position !== 0 ? position : a.id - b.id;
                    });
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    ngOnInit() {
        this.loadAllCategoryAcademicYears();
        this.loadAllCategoryGrades();
        this.loadAllCategorySemesters();
        this.loadAllCategorySubjects();
        this.loadAllCategoryPublishers();

        this.registerChangeInCategoryAcademicYears();
        this.registerChangeInCategoryGrades();
        this.registerChangeInCategorySemesters();
        this.registerChangeInCategorySubjects();
        this.registerChangeInCategoryPublishers();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.categoryAcademicYearsEventSubscriber);
        this.eventManager.destroy(this.categoryGradesEventSubscriber);
        this.eventManager.destroy(this.categorySemestersEventSubscriber);
        this.eventManager.destroy(this.categorySubjectsEventSubscriber);
        this.eventManager.destroy(this.categoryPublishersEventSubscriber);
    }

    registerChangeInCategoryAcademicYears() {
        this.categoryAcademicYearsEventSubscriber = this.eventManager.subscribe('categoryAcademicYearListModification', (response) => this.loadAllCategoryAcademicYears());
    }

    registerChangeInCategoryGrades() {
        this.categoryGradesEventSubscriber = this.eventManager.subscribe('categoryGradeListModification', (response) => this.loadAllCategoryGrades());
    }

    registerChangeInCategorySemesters() {
        this.categorySemestersEventSubscriber = this.eventManager.subscribe('categorySemesterListModification', (response) => this.loadAllCategorySemesters());
    }

    registerChangeInCategorySubjects() {
        this.categorySubjectsEventSubscriber = this.eventManager.subscribe('categorySubjectListModification', (response) => this.loadAllCategorySubjects());
    }

    registerChangeInCategoryPublishers() {
        this.categoryPublishersEventSubscriber = this.eventManager.subscribe('categoryPublisherListModification', (response) => this.loadAllCategoryPublishers());
    }

    nodeAction(event: Event, index: number, node: TreeNode) {
        event.stopPropagation();

        console.log(event);
        console.log(index);
        console.log(node);
    }

    levelName(level: number) {
        return {1: '學年', 2: '年級', 3: '學期', 4: '科目', 5: '出版社'}[level];
    }

    availableChildren(level: number): Category[] {
        return {
            1: this.categoryAcademicYears,
            2: this.categoryGrades,
            3: this.categorySemesters,
            4: this.categorySubjects,
            5: this.categoryPublishers
        }[level] || [];
    }

    addNode(node: TreeNode, item: Category) {
        const nodeData = node.data;
        if (!nodeData.hasOwnProperty('children')) {
            nodeData.children = [];
        }

        nodeData.children.push({
            name: item.name,
            typeId: item.id
        });
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

    alert(message: string) {
        this.alertService.error(message, null, null);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

}
