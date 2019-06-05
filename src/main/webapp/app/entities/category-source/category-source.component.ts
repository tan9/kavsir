import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ICategorySource } from 'app/shared/model/category-source.model';
import { AccountService } from 'app/core';
import { CategorySourceService } from './category-source.service';

@Component({
  selector: 'jhi-category-source',
  templateUrl: './category-source.component.html'
})
export class CategorySourceComponent implements OnInit, OnDestroy {
  categorySources: ICategorySource[];
  currentAccount: any;
  eventSubscriber: Subscription;
  currentSearch: string;

  constructor(
    protected categorySourceService: CategorySourceService,
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
      this.categorySourceService
        .search({
          query: this.currentSearch
        })
        .pipe(
          filter((res: HttpResponse<ICategorySource[]>) => res.ok),
          map((res: HttpResponse<ICategorySource[]>) => res.body)
        )
        .subscribe((res: ICategorySource[]) => (this.categorySources = res), (res: HttpErrorResponse) => this.onError(res.message));
      return;
    }
    this.categorySourceService
      .query()
      .pipe(
        filter((res: HttpResponse<ICategorySource[]>) => res.ok),
        map((res: HttpResponse<ICategorySource[]>) => res.body)
      )
      .subscribe(
        (res: ICategorySource[]) => {
          this.categorySources = res;
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
    this.registerChangeInCategorySources();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICategorySource) {
    return item.id;
  }

  registerChangeInCategorySources() {
    this.eventSubscriber = this.eventManager.subscribe('categorySourceListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
