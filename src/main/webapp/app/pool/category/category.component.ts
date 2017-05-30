import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResponseWrapper } from '../../shared/model/response-wrapper.model';
import { EventManager, AlertService } from 'ng-jhipster';
import { CategoryAcademicYear, CategoryAcademicYearService } from '../../entities/category-academic-year';
import { CategoryGrade, CategoryGradeService } from '../../entities/category-grade';
import { CategorySemester, CategorySemesterService } from '../../entities/category-semester';
import { CategorySubject, CategorySubjectService } from '../../entities/category-subject';
import { CategoryPublisher, CategoryPublisherService } from '../../entities/category-publisher';

import { Subscription } from 'rxjs/Rx';

@Component({
    selector: 'jhi-category',
    templateUrl: './category.component.html',
    styles: []
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

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

}
