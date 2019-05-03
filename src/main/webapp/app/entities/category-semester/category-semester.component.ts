import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICategorySemester } from 'app/shared/model/category-semester.model';
import { AccountService } from 'app/core';
import { CategorySemesterService } from './category-semester.service';

@Component({
  selector: 'jhi-category-semester',
  templateUrl: './category-semester.component.html'
})
export class CategorySemesterComponent implements OnInit, OnDestroy {
  categorySemesters: ICategorySemester[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected categorySemesterService: CategorySemesterService,
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
      this.categorySemesterService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<ICategorySemester[]>) => res.ok),
          map((res: HttpResponse<ICategorySemester[]>) => res.body)
        )
        .subscribe((res: ICategorySemester[]) => (this.categorySemesters = res), (res: HttpErrorResponse) => this.onError(res.message));
      return;
    }
    this.categorySemesterService
      .query()
      .pipe(
        filter((res: HttpResponse<ICategorySemester[]>) => res.ok),
        map((res: HttpResponse<ICategorySemester[]>) => res.body)
      )
      .subscribe(
        (res: ICategorySemester[]) => {
          this.categorySemesters = res;
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
    this.registerChangeInCategorySemesters();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICategorySemester) {
    return item.id;
  }

  registerChangeInCategorySemesters() {
    this.eventSubscriber = this.eventManager.subscribe('categorySemesterListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
