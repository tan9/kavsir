import { Component, Input } from '@angular/core';
import { QuestionEssayComponent } from '../../../entities/question-essay/index';
import { ResponseWrapper } from '../../../shared/model/response-wrapper.model';
import { TreeNode } from 'angular-tree-component';

@Component({
    selector: 'jhi-category-essay',
    templateUrl: './category-essay.component.html'
})
export class CategoryEssayComponent extends QuestionEssayComponent {

    inGroup = false;

    @Input() categories: TreeNode[] = [];

    transition() {
        this.router.navigate(['/question/essay'], {
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
        this.router.navigate(['/question/essay', {
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
        this.router.navigate(['/question/essay', {
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
            if (this.categories.length > 0) {
                searchReq['categories'] = this.categories.map((node) => node.data.id);
            }
            this.questionEssayService.search(searchReq).subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
            return;
        }
        const req = {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort()};
        if (this.categories.length > 0) {
            req['categories'] = this.categories.map((node) => node.data.id);
        }
        this.questionEssayService.query(req).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

}
