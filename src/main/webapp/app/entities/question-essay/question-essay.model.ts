import { BaseEntity } from './../../shared';

export class QuestionEssay implements BaseEntity {
    constructor(
        public id?: number,
        public text?: string,
        public answer?: string,
        public memo?: string,
        public groupPosition?: number,
        public categories?: BaseEntity[],
        public images?: BaseEntity[],
        public questionGroupId?: number,
    ) {
        this.images = [];
    }
}
