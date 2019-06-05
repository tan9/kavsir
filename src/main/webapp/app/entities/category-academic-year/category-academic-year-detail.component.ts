import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategoryAcademicYear } from 'app/shared/model/category-academic-year.model';

@Component({
  selector: 'jhi-category-academic-year-detail',
  templateUrl: './category-academic-year-detail.component.html'
})
export class CategoryAcademicYearDetailComponent implements OnInit {
  categoryAcademicYear: ICategoryAcademicYear;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categoryAcademicYear }) => {
      this.categoryAcademicYear = categoryAcademicYear;
    });
  }

  previousState() {
    window.history.back();
  }
}
