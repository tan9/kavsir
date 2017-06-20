import { Injectable, OnInit } from '@angular/core';

import { CategoryAcademicYearService, CategoryAcademicYear } from '../../entities/category-academic-year';
import { CategoryGradeService, CategoryGrade } from '../../entities/category-grade';
import { CategorySemesterService, CategorySemester } from '../../entities/category-semester';
import { CategorySubjectService, CategorySubject } from '../../entities/category-subject';
import { CategoryPublisherService, CategoryPublisher } from '../../entities/category-publisher';

@Injectable()
export class CategoriesService implements OnInit {

    academicYears: CategoryAcademicYear[] = [];
    grades: CategoryGrade[] = [];
    semesters: CategorySemester[] = [];
    subjects: CategorySubject[] = [];
    publishers: CategoryPublisher[] = [];

    constructor(public academicYearService: CategoryAcademicYearService,
                public gradeService: CategoryGradeService,
                public semesterService: CategorySemesterService,
                public subjectService: CategorySubjectService,
                public publisherService: CategoryPublisherService) {
    }

    ngOnInit(): void {
    }

}
