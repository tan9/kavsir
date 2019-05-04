package com.tj.kvasir.service.dto;


import javax.validation.constraints.*;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the QuestionEssay entity.
 */
public class QuestionEssayDTO extends QuestionDTO {

    @NotNull
    @Lob
    private String text;

    @NotNull
    @Lob
    private String answer;

    private String memo;

    private Integer groupPosition;

    private Set<CategoryNodeDTO> categories = new HashSet<>();

    private Set<ResourceImageDTO> images = new HashSet<>();

    private Long questionGroupId;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
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

        QuestionEssayDTO questionEssayDTO = (QuestionEssayDTO) o;
        if(questionEssayDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionEssayDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionEssayDTO{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", answer='" + getAnswer() + "'" +
            ", memo='" + getMemo() + "'" +
            ", groupPosition=" + getGroupPosition() +
            "}";
    }
}
