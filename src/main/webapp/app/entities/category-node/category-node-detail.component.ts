import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICategoryNode } from 'app/shared/model/category-node.model';

@Component({
  selector: 'jhi-category-node-detail',
  templateUrl: './category-node-detail.component.html'
})
export class CategoryNodeDetailComponent implements OnInit {
  categoryNode: ICategoryNode;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ categoryNode }) => {
      this.categoryNode = categoryNode;
    });
  }

  previousState() {
    window.history.back();
  }
}
