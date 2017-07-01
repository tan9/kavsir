import { Component, Input } from '@angular/core';
import { QuestionChoiceComponent } from '../../../entities/question-choice/index';
import { ResponseWrapper } from '../../../shared/model/response-wrapper.model';
import { CategoryNode } from '../../../entities/category-node/category-node.model';

@Component({
    selector: 'jhi-category-choice',
    templateUrl: './category-choice.component.html'
})
export class CategoryChoiceComponent extends QuestionChoiceComponent {

    inGroup = false;
    multipleResponse : boolean;

    @Input() categories: CategoryNode[] = [];

    ngOnInit() {
        this.multipleResponse = 'multiple-response' === this.activatedRoute.snapshot.url[1].path;
        super.ngOnInit();
    }

    private getPath() {
        return this.multipleResponse ? '/question/multiple-response' : '/question/choice';
    }

    transition() {
        this.router.navigate([this.getPath()], {
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
        this.router.navigate([this.getPath(), {
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
        this.router.navigate([this.getPath(), {
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
                sort: this.sort(),
                multi: this.multipleResponse
            };
            if (this.categories.length > 0) {
                searchReq['categories'] = this.categories.map((node) => node.id);
            }
            this.questionChoiceService.search(searchReq).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
            return;
        }
        const req = {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            multi: this.multipleResponse};
        if (this.categories.length > 0) {
            req['categories'] = this.categories.map((node) => node.id);
        }
        this.questionChoiceService.query(req).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    protected onSuccess(data, headers) {
        super.onSuccess(data, headers);

        this.questionChoices.forEach((questionChoice) => {
            // FIXME performance??
            this.questionChoiceOptionService
                .query({questionChoiceId: questionChoice.id})
                .subscribe((res) => questionChoice.options = res.json);
        });
    }

}
