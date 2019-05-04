package com.tj.kvasir.service.dto;

import java.util.List;

import static java.util.Objects.requireNonNull;

public class QuestionChoiceAndOptionsDTO extends QuestionDTO {

    private QuestionChoiceDTO question;
    private List<QuestionChoiceOptionDTO> options;

    @Override
    public void setId(Long id) {
        question.setId(id);
    }

    @Override
    public Long getId() {
        return question.getId();
    }

    public QuestionChoiceAndOptionsDTO(QuestionChoiceDTO question,
                                       List<QuestionChoiceOptionDTO> options) {
        this.question = requireNonNull(question);
        this.options = requireNonNull(options);
    }

    public QuestionChoiceDTO getQuestion() {
        return question;
    }

    public List<QuestionChoiceOptionDTO> getOptions() {
        return options;
    }

    @Override
    public String toString() {
        return "QuestionChoiceAndOptionsDTO{" +
            "question=" + question +
            ", options=" + options +
            '}';
    }
}
