import { Component, Input } from '@angular/core';
import { QuestionTrueFalseComponent } from '../../../entities/question-true-false/index';
import { ResponseWrapper } from '../../../shared/model/response-wrapper.model';
import { CategoryHierarchyService } from '../../../shared/category/category-hierarchy.service';

@Component({
    selector: 'jhi-category-true-false',
    templateUrl: './category-true-false.component.html'
})
export class CategoryTrueFalseComponent extends QuestionTrueFalseComponent {

    inGroup = false;

    // not using normal inject because we do wanna to tight to the super constructor
    @Input() categoryHierarchyService: CategoryHierarchyService;

    transition() {
        this.router.navigate(['/question/true-false'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate(['/question/true-false', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate(['/question/true-false', {
            search: this.currentSearch,
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        this.loadAll();
    }

    loadAll() {
        if (this.currentSearch) {
            const searchReq = {
                query: this.currentSearch,
                size: this.itemsPerPage,
                sort: this.sort()
            };
            if (this.categoryHierarchyService.getWorkingCategory()) {
                searchReq['categories'] = [this.categoryHierarchyService.getWorkingCategory().id];
            }
            this.questionTrueFalseService.search(searchReq).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
            return;
        }
        const req = {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()};
        if (this.categoryHierarchyService.getWorkingCategory()) {
            req['categories'] = [this.categoryHierarchyService.getWorkingCategory().id];
        }
        this.questionTrueFalseService.query(req).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

}
