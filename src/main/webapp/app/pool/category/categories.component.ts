import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CategoryAcademicYearService } from '../../entities/category-academic-year';
import { CategoryGradeService } from '../../entities/category-grade';
import { CategorySemesterService } from '../../entities/category-semester';
import { CategorySubjectService, CategorySubject } from '../../entities/category-subject';
import { CategoryPublisherService } from '../../entities/category-publisher';
import { CategoryAcademicYear } from '../../entities/category-academic-year/category-academic-year.model';
import { CategoryGrade } from '../../entities/category-grade/category-grade.model';
import { CategorySemester } from '../../entities/category-semester/category-semester.model';
import { CategoryPublisher } from '../../entities/category-publisher/category-publisher.model';

@Component({
    selector: 'jhi-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {

    categoryAcademicYears: CategoryAcademicYear[] = [];
    categoryGrades: CategoryGrade[] = [];
    categorySemesters: CategorySemester[] = [];
    categorySubjects: CategorySubject[] = [];
    categoryPublishers: CategoryPublisher[] = [];

    constructor(public categoryAcademicYearService: CategoryAcademicYearService,
                public categoryGradeService: CategoryGradeService,
                public categorySemesterService: CategorySemesterService,
                public categorySubjectService: CategorySubjectService,
                public categoryPublisherService: CategoryPublisherService) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

}
