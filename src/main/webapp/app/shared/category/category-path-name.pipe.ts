import { Pipe, PipeTransform } from '@angular/core';
import { CategoryHierarchyService } from './category-hierarchy.service';

@Pipe({name: 'categoryPathName'})
export class CategoryPathNamePipe implements PipeTransform {

    constructor(private categoryHierarchyService: CategoryHierarchyService) {
    }

    transform(categoryId: number): string {
        return this.categoryHierarchyService.pathDisplayName(categoryId);
    }
}
