import { Component, Input } from '@angular/core';

import { QuestionChoiceOption } from '../question-choice-option';

@Component({
    selector: 'jhi-choice-options',
    templateUrl: './choice-options.component.html',
    styleUrls: [ './choice-options.component.css' ]
})
export class ChoiceOptionsComponent {

    @Input() choiceOptions: QuestionChoiceOption[];

}
