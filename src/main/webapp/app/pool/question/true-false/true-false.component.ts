import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { CategoryHierarchyService } from '../../../shared/category/category-hierarchy.service';

@Component({
  selector: 'jhi-true-false',
  templateUrl: './true-false.component.html',
  styleUrls: ['./true-false.component.scss']
})
export class TrueFalseComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(public categoryHierarchyService: CategoryHierarchyService, private eventManager: JhiEventManager) {}

  ngOnInit(): void {
    this.subscription = this.eventManager.subscribe('categorySelected', () => {
      setTimeout(() => this.eventManager.broadcast({ name: 'questionTrueFalseListModification', content: 'Category Selected.' }));
    });
  }

  ngOnDestroy(): void {
    this.eventManager.destroy(this.subscription);
  }
}
