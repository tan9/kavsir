import { Component } from '@angular/core';
import { QuestionTrueFalseComponent } from '../../../entities/question-true-false/question-true-false.component';

@Component({
    templateUrl: './true-false.component.html',
    selector: 'jhi-true-false'
})
export class TrueFalseComponent extends QuestionTrueFalseComponent {

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
