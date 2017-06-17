import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CategoryAcademicYearService } from '../../entities/category-academic-year';
import { CategoryGradeService } from '../../entities/category-grade';
import { CategorySemesterService } from '../../entities/category-semester';
import { CategorySubjectService, CategorySubject } from '../../entities/category-subject';
import { CategoryPublisherService } from '../../entities/category-publisher';
import { CategoryAcademicYear } from '../../entities/category-academic-year/category-academic-year.model';
import { CategoryGrade } from '../../entities/category-grade/category-grade.model';
import { CategorySemester } from '../../entities/category-semester/category-semester.model';
import { CategoryPublisher } from '../../entities/category-publisher/category-publisher.model';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'jhi-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy, AfterViewInit {

    categoryAcademicYears: CategoryAcademicYear[] = [];
    categoryGrades: CategoryGrade[] = [];
    categorySemesters: CategorySemester[] = [];
    categorySubjects: CategorySubject[] = [];
    categoryPublishers: CategoryPublisher[] = [];

    @ViewChild(NgbTabset) tabset: NgbTabset;

    constructor(public categoryAcademicYearService: CategoryAcademicYearService,
                public categoryGradeService: CategoryGradeService,
                public categorySemesterService: CategorySemesterService,
                public categorySubjectService: CategorySubjectService,
                public categoryPublisherService: CategoryPublisherService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        // FIXME a dirty workaround to make tab been eager loaded.
        this.tabset.select('tab-publishers');
        this.tabset.select('tab-subjects');
        this.tabset.select('tab-semesters');
        this.tabset.select('tab-grades');
        this.tabset.select('tab-academic-years');
    }

    ngOnDestroy() {
    }

}
