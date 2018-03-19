package com.tj.kvasir.service.dto;


import javax.validation.constraints.*;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the QuestionTrueFalse entity.
 */
public class QuestionTrueFalseDTO extends QuestionDTO {

    @NotNull
    private Boolean correct;

    @NotNull
    @Lob
    private String text;

    private String memo;

    private Integer groupPosition;

    private Set<CategoryNodeDTO> categories = new HashSet<>();

    private Set<ResourceImageDTO> images = new HashSet<>();

    private Long questionGroupId;

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

    public Integer getGroupPosition() {
        return groupPosition;
    }

    public void setGroupPosition(Integer groupPosition) {
        this.groupPosition = groupPosition;
    }

    public Set<CategoryNodeDTO> getCategories() {
        return categories;
    }

    public void setCategories(Set<CategoryNodeDTO> categoryNodes) {
        this.categories = categoryNodes;
    }

    public Set<ResourceImageDTO> getImages() {
        return images;
    }

    public void setImages(Set<ResourceImageDTO> resourceImages) {
        this.images = resourceImages;
    }

    public Long getQuestionGroupId() {
        return questionGroupId;
    }

    public void setQuestionGroupId(Long questionGroupId) {
        this.questionGroupId = questionGroupId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        QuestionTrueFalseDTO questionTrueFalseDTO = (QuestionTrueFalseDTO) o;
        if(questionTrueFalseDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionTrueFalseDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionTrueFalseDTO{" +
            "id=" + getId() +
            ", correct='" + isCorrect() + "'" +
            ", text='" + getText() + "'" +
            ", memo='" + getMemo() + "'" +
            ", groupPosition='" + getGroupPosition() + "'" +
            "}";
    }
}
