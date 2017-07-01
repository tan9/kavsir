import { Component, Input } from '@angular/core';

import { QuestionChoiceOption } from '../../entities/question-choice-option';

@Component({
    selector: 'jhi-choice-options',
    templateUrl: './choice-options.component.html',
    styleUrls: [ './choice-options.component.css' ]
})
export class ChoiceOptionsComponent {

    @Input() choiceOptions: QuestionChoiceOption[];

    optionsDeleted: QuestionChoiceOption[] = [];

    @Input() editable: false;

    removeOption(index: number) {
        this.optionsDeleted.push.apply(this.optionsDeleted, this.choiceOptions.splice(index, 1));
    }

    isEditing() {
        return this.choiceOptions && this.choiceOptions.some((option) => option['isEditing']);
    }

    addOption() {
        const option = new QuestionChoiceOption();
        option['isEditing'] = true;
        if (!this.choiceOptions) {
            this.choiceOptions = [];
        }
        this.choiceOptions.push(option);
    }
}
