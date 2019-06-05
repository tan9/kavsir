import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICategorySubject } from 'app/shared/model/category-subject.model';
import { AccountService } from 'app/core';
import { CategorySubjectService } from './category-subject.service';

@Component({
  selector: 'jhi-category-subject',
  templateUrl: './category-subject.component.html'
})
export class CategorySubjectComponent implements OnInit, OnDestroy {
  categorySubjects: ICategorySubject[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected categorySubjectService: CategorySubjectService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService
  ) {
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ? this.activatedRoute.snapshot.params['search'] : '';
  }

  loadAll() {
    if (this.currentSearch) {
      this.categorySubjectService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<ICategorySubject[]>) => res.ok),
          map((res: HttpResponse<ICategorySubject[]>) => res.body)
        )
        .subscribe((res: ICategorySubject[]) => (this.categorySubjects = res), (res: HttpErrorResponse) => this.onError(res.message));
      return;
    }
    this.categorySubjectService
      .query()
      .pipe(
        filter((res: HttpResponse<ICategorySubject[]>) => res.ok),
        map((res: HttpResponse<ICategorySubject[]>) => res.body)
      )
      .subscribe(
        (res: ICategorySubject[]) => {
          this.categorySubjects = res;
          this.currentSearch = '';
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  search(query) {
    if (!query) {
      return this.clear();
    }
    this.currentSearch = query;
    this.loadAll();
  }

  clear() {
    this.currentSearch = '';
    this.loadAll();
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInCategorySubjects();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICategorySubject) {
    return item.id;
  }

  registerChangeInCategorySubjects() {
    this.eventSubscriber = this.eventManager.subscribe('categorySubjectListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
