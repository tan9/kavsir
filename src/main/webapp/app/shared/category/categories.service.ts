import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { CategoryAcademicYearService, CategoryAcademicYear } from '../../entities/category-academic-year';
import { CategoryGradeService, CategoryGrade } from '../../entities/category-grade';
import { CategorySemesterService, CategorySemester } from '../../entities/category-semester';
import { CategorySubjectService, CategorySubject } from '../../entities/category-subject';
import { CategoryPublisherService, CategoryPublisher } from '../../entities/category-publisher';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs/Subscription';
import { ResponseWrapper } from '../model/response-wrapper.model';
import { Category } from '../../entities/category.model';

@Injectable()
export class CategoriesService implements OnInit, OnDestroy {

    private academicYearsEventSubscriber: Subscription;
    private gradesEventSubscriber: Subscription;
    private semestersEventSubscriber: Subscription;
    private subjectsEventSubscriber: Subscription;
    private publishersEventSubscriber: Subscription;

    academicYears: CategoryAcademicYear[] = [];
    grades: CategoryGrade[] = [];
    semesters: CategorySemester[] = [];
    subjects: CategorySubject[] = [];
    publishers: CategoryPublisher[] = [];

    constructor(public academicYearService: CategoryAcademicYearService,
                public gradeService: CategoryGradeService,
                public semesterService: CategorySemesterService,
                public subjectService: CategorySubjectService,
                public publisherService: CategoryPublisherService,
                private eventManager: JhiEventManager,
                private alertService: JhiAlertService) {
    }

    ngOnInit() {
        ['academicYear', 'grade', 'semester', 'subject', 'publisher'].forEach(
            (typeName) => {
                this.loadAllCategoryItems(typeName);
                this.registerChangeInCategoryItems(typeName);
            }
        );
    }

    ngOnDestroy() {
        ['academicYear', 'grade', 'semester', 'subject', 'publisher'].forEach(
            (typeName) => {
                const subscriberName = typeName + 'sEventSubscriber';
                this.eventManager.destroy(this[subscriberName]);
            }
        );
    }

    private capitalize(text: string): string {
        return text.substring(0, 1).toUpperCase() + text.substring(1);
    }

    registerChangeInCategoryItems(typeName: string) {
        const eventName = 'category' + this.capitalize(typeName) + 'ListModification';
        this[typeName + 'EventSubscriber'] = this.eventManager.subscribe(
            eventName, (response) => this.loadAllCategoryItems(typeName));
    }

    loadAllCategoryItems(typeName: string) {
        this[typeName + 'Service'].query().subscribe(
            (res: ResponseWrapper) => {
                this[typeName + 's'].length = 0;
                const newItems = res.json.sort(
                    (a: Category, b: Category) => {
                        const position = a.position - b.position;
                        return position !== 0 ? position : a.id - b.id;
                    });
                Array.prototype.push.apply(this[typeName + 's'], newItems);
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
