import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICategoryGrade } from 'app/shared/model/category-grade.model';
import { AccountService } from 'app/core';
import { CategoryGradeService } from './category-grade.service';

@Component({
  selector: 'jhi-category-grade',
  templateUrl: './category-grade.component.html'
})
export class CategoryGradeComponent implements OnInit, OnDestroy {
  categoryGrades: ICategoryGrade[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected categoryGradeService: CategoryGradeService,
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
      this.categoryGradeService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<ICategoryGrade[]>) => res.ok),
          map((res: HttpResponse<ICategoryGrade[]>) => res.body)
        )
        .subscribe((res: ICategoryGrade[]) => (this.categoryGrades = res), (res: HttpErrorResponse) => this.onError(res.message));
      return;
    }
    this.categoryGradeService
      .query()
      .pipe(
        filter((res: HttpResponse<ICategoryGrade[]>) => res.ok),
        map((res: HttpResponse<ICategoryGrade[]>) => res.body)
      )
      .subscribe(
        (res: ICategoryGrade[]) => {
          this.categoryGrades = res;
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
    this.registerChangeInCategoryGrades();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICategoryGrade) {
    return item.id;
  }

  registerChangeInCategoryGrades() {
    this.eventSubscriber = this.eventManager.subscribe('categoryGradeListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
