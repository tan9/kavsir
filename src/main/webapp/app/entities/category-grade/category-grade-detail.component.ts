import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategoryGrade } from 'app/shared/model/category-grade.model';

@Component({
  selector: 'jhi-category-grade-detail',
  templateUrl: './category-grade-detail.component.html'
})
export class CategoryGradeDetailComponent implements OnInit {
  categoryGrade: ICategoryGrade;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categoryGrade }) => {
      this.categoryGrade = categoryGrade;
    });
  }

  previousState() {
    window.history.back();
  }
}
