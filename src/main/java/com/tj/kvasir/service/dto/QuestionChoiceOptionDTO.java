package com.tj.kvasir.service.dto;


import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the QuestionChoiceOption entity.
 */
public class QuestionChoiceOptionDTO implements Serializable {

    private Long id;

    @NotNull
    private Boolean correct;

    @NotNull
    @Lob
    private String text;

    private String memo;

    private Long questionChoiceId;

    private Set<ResourceImageDTO> images = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public Long getQuestionChoiceId() {
        return questionChoiceId;
    }

    public void setQuestionChoiceId(Long questionChoiceId) {
        this.questionChoiceId = questionChoiceId;
    }

    public Set<ResourceImageDTO> getImages() {
        return images;
    }

    public void setImages(Set<ResourceImageDTO> resourceImages) {
        this.images = resourceImages;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        QuestionChoiceOptionDTO questionChoiceOptionDTO = (QuestionChoiceOptionDTO) o;
        if(questionChoiceOptionDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionChoiceOptionDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionChoiceOptionDTO{" +
            "id=" + getId() +
            ", correct='" + isCorrect() + "'" +
            ", text='" + getText() + "'" +
            ", memo='" + getMemo() + "'" +
            "}";
    }
}
