import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { CategoryHierarchyService } from '../../../shared/category/category-hierarchy.service';

@Component({
  selector: 'jhi-choice',
  templateUrl: './choice.component.html',
  styleUrls: ['./choice.component.scss']
})
export class ChoiceComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(public categoryHierarchyService: CategoryHierarchyService, private eventManager: JhiEventManager) {}

  ngOnInit(): void {
    this.subscription = this.eventManager.subscribe('categorySelected', () => {
      setTimeout(() => this.eventManager.broadcast({ name: 'questionChoiceListModification', content: 'Category Selected.' }));
    });
  }

  ngOnDestroy(): void {
    this.eventManager.destroy(this.subscription);
  }
}
