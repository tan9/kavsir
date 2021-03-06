package com.tj.kvasir.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import com.tj.kvasir.domain.enumeration.CategoryType;

/**
 * 類別節點
 */
@Entity
@Table(name = "category_node")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "categorynode")
public class CategoryNode implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private CategoryType type;

    /**
     * 類別 ID，在 type !== SEGMENT 時需指定到 type 對應表格資料
     */
    @Column(name = "type_id")
    private Long typeId;

    /**
     * 名稱 (章、課、篇、節)，只有在 type == SEGMENT 時有效
     */
    @Column(name = "name")
    private String name;

    /**
     * 序位
     */
    @Column(name = "position")
    private Integer position;

    @ManyToOne
    @JsonIgnoreProperties("categoryNodes")
    private CategoryNode parent;

    @ManyToMany(mappedBy = "categories")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<QuestionTrueFalse> trueOrFalses = new HashSet<>();

    @ManyToMany(mappedBy = "categories")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<QuestionChoice> choices = new HashSet<>();

    @ManyToMany(mappedBy = "categories")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<QuestionEssay> essays = new HashSet<>();

    @ManyToMany(mappedBy = "categories")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JsonIgnore
    private Set<QuestionGroup> groups = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CategoryType getType() {
        return type;
    }

    public CategoryNode type(CategoryType type) {
        this.type = type;
        return this;
    }

    public void setType(CategoryType type) {
        this.type = type;
    }

    public Long getTypeId() {
        return typeId;
    }

    public CategoryNode typeId(Long typeId) {
        this.typeId = typeId;
        return this;
    }

    public void setTypeId(Long typeId) {
        this.typeId = typeId;
    }

    public String getName() {
        return name;
    }

    public CategoryNode name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPosition() {
        return position;
    }

    public CategoryNode position(Integer position) {
        this.position = position;
        return this;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public CategoryNode getParent() {
        return parent;
    }

    public CategoryNode parent(CategoryNode categoryNode) {
        this.parent = categoryNode;
        return this;
    }

    public void setParent(CategoryNode categoryNode) {
        this.parent = categoryNode;
    }

    public Set<QuestionTrueFalse> getTrueOrFalses() {
        return trueOrFalses;
    }

    public CategoryNode trueOrFalses(Set<QuestionTrueFalse> questionTrueFalses) {
        this.trueOrFalses = questionTrueFalses;
        return this;
    }

    public CategoryNode addTrueOrFalse(QuestionTrueFalse questionTrueFalse) {
        this.trueOrFalses.add(questionTrueFalse);
        questionTrueFalse.getCategories().add(this);
        return this;
    }

    public CategoryNode removeTrueOrFalse(QuestionTrueFalse questionTrueFalse) {
        this.trueOrFalses.remove(questionTrueFalse);
        questionTrueFalse.getCategories().remove(this);
        return this;
    }

    public void setTrueOrFalses(Set<QuestionTrueFalse> questionTrueFalses) {
        this.trueOrFalses = questionTrueFalses;
    }

    public Set<QuestionChoice> getChoices() {
        return choices;
    }

    public CategoryNode choices(Set<QuestionChoice> questionChoices) {
        this.choices = questionChoices;
        return this;
    }

    public CategoryNode addChoice(QuestionChoice questionChoice) {
        this.choices.add(questionChoice);
        questionChoice.getCategories().add(this);
        return this;
    }

    public CategoryNode removeChoice(QuestionChoice questionChoice) {
        this.choices.remove(questionChoice);
        questionChoice.getCategories().remove(this);
        return this;
    }

    public void setChoices(Set<QuestionChoice> questionChoices) {
        this.choices = questionChoices;
    }

    public Set<QuestionEssay> getEssays() {
        return essays;
    }

    public CategoryNode essays(Set<QuestionEssay> questionEssays) {
        this.essays = questionEssays;
        return this;
    }

    public CategoryNode addEssay(QuestionEssay questionEssay) {
        this.essays.add(questionEssay);
        questionEssay.getCategories().add(this);
        return this;
    }

    public CategoryNode removeEssay(QuestionEssay questionEssay) {
        this.essays.remove(questionEssay);
        questionEssay.getCategories().remove(this);
        return this;
    }

    public void setEssays(Set<QuestionEssay> questionEssays) {
        this.essays = questionEssays;
    }

    public Set<QuestionGroup> getGroups() {
        return groups;
    }

    public CategoryNode groups(Set<QuestionGroup> questionGroups) {
        this.groups = questionGroups;
        return this;
    }

    public CategoryNode addGroup(QuestionGroup questionGroup) {
        this.groups.add(questionGroup);
        questionGroup.getCategories().add(this);
        return this;
    }

    public CategoryNode removeGroup(QuestionGroup questionGroup) {
        this.groups.remove(questionGroup);
        questionGroup.getCategories().remove(this);
        return this;
    }

    public void setGroups(Set<QuestionGroup> questionGroups) {
        this.groups = questionGroups;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CategoryNode)) {
            return false;
        }
        return id != null && id.equals(((CategoryNode) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "CategoryNode{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", typeId=" + getTypeId() +
            ", name='" + getName() + "'" +
            ", position=" + getPosition() +
            "}";
    }
}
