import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategorySource } from 'app/shared/model/category-source.model';

@Component({
  selector: 'jhi-category-source-detail',
  templateUrl: './category-source-detail.component.html'
})
export class CategorySourceDetailComponent implements OnInit {
  categorySource: ICategorySource;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categorySource }) => {
      this.categorySource = categorySource;
    });
  }

  previousState() {
    window.history.back();
  }
}
