import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategorySemester } from 'app/shared/model/category-semester.model';

@Component({
  selector: 'jhi-category-semester-detail',
  templateUrl: './category-semester-detail.component.html'
})
export class CategorySemesterDetailComponent implements OnInit {
  categorySemester: ICategorySemester;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categorySemester }) => {
      this.categorySemester = categorySemester;
    });
  }

  previousState() {
    window.history.back();
  }
}
