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
 * A DTO for the {@link com.tj.kvasir.domain.QuestionGroup} entity.
 */
@ApiModel(description = "題組")
public class QuestionGroupDTO implements Serializable {

    private Long id;

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


    private Set<CategoryNodeDTO> categories = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Set<CategoryNodeDTO> getCategories() {
        return categories;
    }

    public void setCategories(Set<CategoryNodeDTO> categoryNodes) {
        this.categories = categoryNodes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        QuestionGroupDTO questionGroupDTO = (QuestionGroupDTO) o;
        if (questionGroupDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionGroupDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionGroupDTO{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", memo='" + getMemo() + "'" +
            "}";
    }
}
