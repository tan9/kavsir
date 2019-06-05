import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICategoryAcademicYear } from 'app/shared/model/category-academic-year.model';
import { AccountService } from 'app/core';
import { CategoryAcademicYearService } from './category-academic-year.service';

@Component({
  selector: 'jhi-category-academic-year',
  templateUrl: './category-academic-year.component.html'
})
export class CategoryAcademicYearComponent implements OnInit, OnDestroy {
  categoryAcademicYears: ICategoryAcademicYear[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected categoryAcademicYearService: CategoryAcademicYearService,
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
      this.categoryAcademicYearService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<ICategoryAcademicYear[]>) => res.ok),
          map((res: HttpResponse<ICategoryAcademicYear[]>) => res.body)
        )
        .subscribe(
          (res: ICategoryAcademicYear[]) => (this.categoryAcademicYears = res),
          (res: HttpErrorResponse) => this.onError(res.message)
        );
      return;
    }
    this.categoryAcademicYearService
      .query()
      .pipe(
        filter((res: HttpResponse<ICategoryAcademicYear[]>) => res.ok),
        map((res: HttpResponse<ICategoryAcademicYear[]>) => res.body)
      )
      .subscribe(
        (res: ICategoryAcademicYear[]) => {
          this.categoryAcademicYears = res;
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
    this.registerChangeInCategoryAcademicYears();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICategoryAcademicYear) {
    return item.id;
  }

  registerChangeInCategoryAcademicYears() {
    this.eventSubscriber = this.eventManager.subscribe('categoryAcademicYearListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
