import { Injectable, OnInit, OnDestroy } from '@angular/core';

import { CategoryAcademicYearService } from '../../entities/category-academic-year';
import { CategoryGradeService } from '../../entities/category-grade';
import { CategorySemesterService } from '../../entities/category-semester';
import { CategorySubjectService } from '../../entities/category-subject';
import { CategorySourceService } from '../../entities/category-source';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { Category } from '../../entities/category.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ICategoryAcademicYear } from 'app/shared/model/category-academic-year.model';
import { ICategoryGrade } from 'app/shared/model/category-grade.model';
import { ICategorySemester } from 'app/shared/model/category-semester.model';
import { ICategorySubject } from 'app/shared/model/category-subject.model';
import { ICategorySource } from 'app/shared/model/category-source.model';

@Injectable()
export class CategoriesService implements OnInit, OnDestroy {
  private academicYearsEventSubscriber: Subscription;
  private gradesEventSubscriber: Subscription;
  private semestersEventSubscriber: Subscription;
  private subjectsEventSubscriber: Subscription;
  private sourcesEventSubscriber: Subscription;

  academicYears: ICategoryAcademicYear[] = [];
  grades: ICategoryGrade[] = [];
  semesters: ICategorySemester[] = [];
  subjects: ICategorySubject[] = [];
  sources: ICategorySource[] = [];

  constructor(
    public academicYearService: CategoryAcademicYearService,
    public gradeService: CategoryGradeService,
    public semesterService: CategorySemesterService,
    public subjectService: CategorySubjectService,
    public sourceService: CategorySourceService,
    private eventManager: JhiEventManager,
    private alertService: JhiAlertService
  ) {
    // Service is not lifecycle-managed, we have to init it by ourselves.
    // https://stackoverflow.com/a/35110798/3440376
    this.ngOnInit();
  }

  ngOnInit() {
    ['academicYear', 'grade', 'semester', 'subject', 'source'].forEach(typeName => {
      this.loadAllCategoryItems(typeName);
      this.registerChangeInCategoryItems(typeName);
    });
  }

  ngOnDestroy() {
    ['academicYear', 'grade', 'semester', 'subject', 'source'].forEach(typeName => {
      const subscriberName = typeName + 'sEventSubscriber';
      this.eventManager.destroy(this[subscriberName]);
    });
  }

  private capitalize(text: string): string {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
  }

  registerChangeInCategoryItems(typeName: string) {
    const eventName = 'category' + this.capitalize(typeName) + 'ListModification';
    this[typeName + 'EventSubscriber'] = this.eventManager.subscribe(eventName, response => this.loadAllCategoryItems(typeName));
  }

  loadAllCategoryItems(typeName: string) {
    this[typeName + 'Service'].query().subscribe(
      (res: HttpResponse<Category[]>) => {
        this[typeName + 's'].length = 0;
        const newItems = res.body.sort((a: Category, b: Category) => {
          const position = a.position - b.position;
          return position !== 0 ? position : a.id - b.id;
        });
        Array.prototype.push.apply(this[typeName + 's'], newItems);
      },
      (res: HttpErrorResponse) => this.onError(res.message)
    );
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }
}
