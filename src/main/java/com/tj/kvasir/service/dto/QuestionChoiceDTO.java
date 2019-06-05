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
 * A DTO for the {@link com.tj.kvasir.domain.QuestionChoice} entity.
 */
@ApiModel(description = "選擇題")
public class QuestionChoiceDTO implements Serializable {

    private Long id;

    /**
     * 是否為複選
     */
    @NotNull
    @ApiModelProperty(value = "是否為複選", required = true)
    private Boolean multipleResponse;

    /**
     * 題目
     */
    
    @ApiModelProperty(value = "題目", required = true)
    @Lob
    private String text;

    /**
     * 備註
     */
    @ApiModelProperty(value = "備註")
    private String memo;

    /**
     * 題組中序位
     */
    @ApiModelProperty(value = "題組中序位")
    private Integer groupPosition;


    private Set<CategoryNodeDTO> categories = new HashSet<>();

    private Set<ResourceImageDTO> images = new HashSet<>();

    private Long questionGroupId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isMultipleResponse() {
        return multipleResponse;
    }

    public void setMultipleResponse(Boolean multipleResponse) {
        this.multipleResponse = multipleResponse;
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

        QuestionChoiceDTO questionChoiceDTO = (QuestionChoiceDTO) o;
        if (questionChoiceDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionChoiceDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionChoiceDTO{" +
            "id=" + getId() +
            ", multipleResponse='" + isMultipleResponse() + "'" +
            ", text='" + getText() + "'" +
            ", memo='" + getMemo() + "'" +
            ", groupPosition=" + getGroupPosition() +
            ", questionGroup=" + getQuestionGroupId() +
            "}";
    }
}
