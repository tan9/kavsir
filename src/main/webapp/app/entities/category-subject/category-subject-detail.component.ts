import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategorySubject } from 'app/shared/model/category-subject.model';

@Component({
  selector: 'jhi-category-subject-detail',
  templateUrl: './category-subject-detail.component.html'
})
export class CategorySubjectDetailComponent implements OnInit {
  categorySubject: ICategorySubject;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categorySubject }) => {
      this.categorySubject = categorySubject;
    });
  }

  previousState() {
    window.history.back();
  }
}
