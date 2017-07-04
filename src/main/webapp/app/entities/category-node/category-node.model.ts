import { BaseEntity } from './../../shared';

const enum CategoryType {
    'ACADEMIC_YEAR',
    'GRADE',
    'SEMESTER',
    'SUBJECT',
    'PUBLISHER',
    'SEGMENT'
}

export class CategoryNode implements BaseEntity {
    constructor(
        public id?: number,
        public type?: CategoryType,
        public typeId?: number,
        public name?: string,
        public position?: number,
        public parent?: BaseEntity,
        public trueOrFalses?: BaseEntity[],
        public choices?: BaseEntity[],
        public essays?: BaseEntity[],
        public groups?: BaseEntity[],
    ) {
    }
}
