package com.tj.kvasir.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * 年級 (一年級 ~ 十二年級)
 */
@ApiModel(description = "年級 (一年級 ~ 十二年級)")
@Entity
@Table(name = "category_grade")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "categorygrade")
public class CategoryGrade implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 順序
     */
    @NotNull
    @ApiModelProperty(value = "順序", required = true)
    @Column(name = "position", nullable = false)
    private Integer position;

    /**
     * 名稱
     */
    @NotNull
    @ApiModelProperty(value = "名稱", required = true)
    @Column(name = "name", nullable = false)
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPosition() {
        return position;
    }

    public CategoryGrade position(Integer position) {
        this.position = position;
        return this;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public String getName() {
        return name;
    }

    public CategoryGrade name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CategoryGrade categoryGrade = (CategoryGrade) o;
        if (categoryGrade.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, categoryGrade.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "CategoryGrade{" +
            "id=" + id +
            ", position='" + position + "'" +
            ", name='" + name + "'" +
            '}';
    }
}
