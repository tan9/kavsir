import { Component } from '@angular/core';
import { QuestionTrueFalseComponent } from '../../../entities/question-true-false/index';

@Component({
    selector: 'jhi-category-true-false',
    templateUrl: './category-true-false.component.html',
    styles: []
})
export class CategoryTrueFalseComponent extends QuestionTrueFalseComponent {

    inGroup: false;

    transition() {
        this.router.navigate(['/question/true-false'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        super.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate(['/question/true-false', {
            page: this.page,
            sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
        }]);
        super.loadAll();
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
        super.loadAll();
    }

}
