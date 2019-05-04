package com.tj.kvasir.service.dto;

import com.google.common.collect.ImmutableSet;

import java.util.Set;

public class QuestionImportDTO {

    public enum HeaderColumn {
        TYPE("題型", "Type"),
        CATEGORY("類別", "Category"),
        TEXT("題目", "Test", "Question"),
        ANSWER("答案", "Answer"),
        MEMO("備註", "Memo");

        HeaderColumn(String ... alias) {
            this.alias = ImmutableSet.copyOf(alias);
        }

        private final Set<String> alias;

        public Set<String> getAlias() {
            return alias;
        }
    }

    public enum QuestionType {
        TRUE_FALSE("是非"),
        CHOICE("單選"),
        MULTIPLE_RESPONE("多選"),
        ESSAY("問答");

        QuestionType(String ... alias) {
            this.alias = ImmutableSet.copyOf(alias);
        }

        private final Set<String> alias;

        public Set<String> getAlias() {
            return alias;
        }
    }
}
