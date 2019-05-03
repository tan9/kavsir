package com.tj.kvasir.service.dto;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;
import com.tj.kvasir.domain.enumeration.CategoryType;

/**
 * A DTO for the {@link com.tj.kvasir.domain.CategoryNode} entity.
 */
@ApiModel(description = "類別節點")
public class CategoryNodeDTO implements Serializable {

    private Long id;

    @NotNull
    private CategoryType type;

    /**
     * 類別 ID，在 type !== SEGMENT 時需指定到 type 對應表格資料
     */
    @ApiModelProperty(value = "類別 ID，在 type !== SEGMENT 時需指定到 type 對應表格資料")
    private Long typeId;

    /**
     * 名稱 (章、課、篇、節)，只有在 type == SEGMENT 時有效
     */
    @ApiModelProperty(value = "名稱 (章、課、篇、節)，只有在 type == SEGMENT 時有效")
    private String name;

    /**
     * 序位
     */
    @ApiModelProperty(value = "序位")
    private Integer position;


    private Long parentId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CategoryType getType() {
        return type;
    }

    public void setType(CategoryType type) {
        this.type = type;
    }

    public Long getTypeId() {
        return typeId;
    }

    public void setTypeId(Long typeId) {
        this.typeId = typeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long categoryNodeId) {
        this.parentId = categoryNodeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        CategoryNodeDTO categoryNodeDTO = (CategoryNodeDTO) o;
        if (categoryNodeDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), categoryNodeDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CategoryNodeDTO{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", typeId=" + getTypeId() +
            ", name='" + getName() + "'" +
            ", position=" + getPosition() +
            ", parent=" + getParentId() +
            "}";
    }
}
