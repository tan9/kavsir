package com.tj.kvasir.service;

import com.tj.kvasir.service.dto.QuestionChoiceAndOptionsDTO;
import com.tj.kvasir.service.dto.QuestionChoiceDTO;
import org.springframework.stereotype.Service;

@Service
public class QuestionChoiceAndOptionsService {

    private final QuestionChoiceService questionChoiceService;

    private final QuestionChoiceOptionService questionChoiceOptionService;

    public QuestionChoiceAndOptionsService(QuestionChoiceService questionChoiceService,
                                           QuestionChoiceOptionService questionChoiceOptionService) {
        this.questionChoiceService = questionChoiceService;
        this.questionChoiceOptionService = questionChoiceOptionService;
    }

    public void save(QuestionChoiceAndOptionsDTO question) {
        QuestionChoiceDTO questionChoice = question.getQuestion();
        questionChoiceService.save(questionChoice);

        question.getOptions().stream().forEach(option -> {
            option.setQuestionChoiceId(questionChoice.getId());
            questionChoiceOptionService.save(option);
        });
    }
}
