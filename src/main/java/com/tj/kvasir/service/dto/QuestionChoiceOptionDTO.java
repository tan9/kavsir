package com.tj.kvasir.service.dto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the {@link com.tj.kvasir.domain.QuestionChoiceOption} entity.
 */
@ApiModel(description = "選擇題選項")
public class QuestionChoiceOptionDTO implements Serializable {

    private Long id;

    /**
     * 是否為正解
     */
    @NotNull
    @ApiModelProperty(value = "是否為正解", required = true)
    private Boolean correct;

    /**
     * 選項內容
     */
    
    @ApiModelProperty(value = "選項內容", required = true)
    @Lob
    private String text;

    /**
     * 備註
     */
    @ApiModelProperty(value = "備註")
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
        if (questionChoiceOptionDTO.getId() == null || getId() == null) {
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
            ", questionChoice=" + getQuestionChoiceId() +
            "}";
    }
}
