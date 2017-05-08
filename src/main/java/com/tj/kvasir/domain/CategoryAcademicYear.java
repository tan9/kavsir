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
 * 學年
 */
@ApiModel(description = "學年")
@Entity
@Table(name = "category_academic_year")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "categoryacademicyear")
public class CategoryAcademicYear implements Serializable {

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

    public CategoryAcademicYear position(Integer position) {
        this.position = position;
        return this;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public String getName() {
        return name;
    }

    public CategoryAcademicYear name(String name) {
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
        CategoryAcademicYear categoryAcademicYear = (CategoryAcademicYear) o;
        if (categoryAcademicYear.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, categoryAcademicYear.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "CategoryAcademicYear{" +
            "id=" + id +
            ", position='" + position + "'" +
            ", name='" + name + "'" +
            '}';
    }
}
