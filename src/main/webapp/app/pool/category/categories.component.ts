import { Component } from '@angular/core';
import { CategoriesService } from '../../shared/category/categories.service';

@Component({
  selector: 'jhi-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  constructor(public categoriesService: CategoriesService) {}
}
