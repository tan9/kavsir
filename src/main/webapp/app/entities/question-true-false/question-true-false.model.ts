import { BaseEntity } from './../../shared';

export class QuestionTrueFalse implements BaseEntity {
    constructor(
        public id?: number,
        public correct?: boolean,
        public text?: any,
        public memo?: string,
        public groupPosition?: number,
        public categories?: BaseEntity[],
        public images?: BaseEntity[],
        public questionGroupId?: number,
    ) {
        this.correct = false;
        this.images = [];
    }
}
