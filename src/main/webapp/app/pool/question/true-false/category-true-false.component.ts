import { Component, OnInit } from '@angular/core';
import { QuestionTrueFalseComponent } from '../../../entities/question-true-false/index';

@Component({
    selector: 'jhi-category-true-false',
    templateUrl: './category-true-false.component.html',
    styles: []
})
export class CategoryTrueFalseComponent extends QuestionTrueFalseComponent {

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

}
