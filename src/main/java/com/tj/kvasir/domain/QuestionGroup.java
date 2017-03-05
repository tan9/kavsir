package com.tj.kvasir.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * 題組
 */
@ApiModel(description = "題組")
@Entity
@Table(name = "question_group")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "questiongroup")
public class QuestionGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 文字描述
     */
    @NotNull
    @ApiModelProperty(value = "文字描述", required = true)
    @Column(name = "text", nullable = false)
    private String text;

    /**
     * 題目來源備註
     */
    @ApiModelProperty(value = "題目來源備註")
    @Column(name = "memo")
    private String memo;

    @OneToMany(mappedBy = "questionGroup")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionChoice> choices = new HashSet<>();

    @OneToMany(mappedBy = "questionGroup")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionTrueFalse> trueFalses = new HashSet<>();

    @OneToMany(mappedBy = "questionGroup")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionEssay> essays = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_group_category",
               joinColumns = @JoinColumn(name="question_groups_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="categories_id", referencedColumnName="id"))
    private Set<CategoryNode> categories = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public QuestionGroup text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getMemo() {
        return memo;
    }

    public QuestionGroup memo(String memo) {
        this.memo = memo;
        return this;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public Set<QuestionChoice> getChoices() {
        return choices;
    }

    public QuestionGroup choices(Set<QuestionChoice> questionChoices) {
        this.choices = questionChoices;
        return this;
    }

    public QuestionGroup addChoice(QuestionChoice questionChoice) {
        this.choices.add(questionChoice);
        questionChoice.setQuestionGroup(this);
        return this;
    }

    public QuestionGroup removeChoice(QuestionChoice questionChoice) {
        this.choices.remove(questionChoice);
        questionChoice.setQuestionGroup(null);
        return this;
    }

    public void setChoices(Set<QuestionChoice> questionChoices) {
        this.choices = questionChoices;
    }

    public Set<QuestionTrueFalse> getTrueFalses() {
        return trueFalses;
    }

    public QuestionGroup trueFalses(Set<QuestionTrueFalse> questionTrueFalses) {
        this.trueFalses = questionTrueFalses;
        return this;
    }

    public QuestionGroup addTrueFalse(QuestionTrueFalse questionTrueFalse) {
        this.trueFalses.add(questionTrueFalse);
        questionTrueFalse.setQuestionGroup(this);
        return this;
    }

    public QuestionGroup removeTrueFalse(QuestionTrueFalse questionTrueFalse) {
        this.trueFalses.remove(questionTrueFalse);
        questionTrueFalse.setQuestionGroup(null);
        return this;
    }

    public void setTrueFalses(Set<QuestionTrueFalse> questionTrueFalses) {
        this.trueFalses = questionTrueFalses;
    }

    public Set<QuestionEssay> getEssays() {
        return essays;
    }

    public QuestionGroup essays(Set<QuestionEssay> questionEssays) {
        this.essays = questionEssays;
        return this;
    }

    public QuestionGroup addEssay(QuestionEssay questionEssay) {
        this.essays.add(questionEssay);
        questionEssay.setQuestionGroup(this);
        return this;
    }

    public QuestionGroup removeEssay(QuestionEssay questionEssay) {
        this.essays.remove(questionEssay);
        questionEssay.setQuestionGroup(null);
        return this;
    }

    public void setEssays(Set<QuestionEssay> questionEssays) {
        this.essays = questionEssays;
    }

    public Set<CategoryNode> getCategories() {
        return categories;
    }

    public QuestionGroup categories(Set<CategoryNode> categoryNodes) {
        this.categories = categoryNodes;
        return this;
    }

    public QuestionGroup addCategory(CategoryNode categoryNode) {
        this.categories.add(categoryNode);
        categoryNode.getGroups().add(this);
        return this;
    }

    public QuestionGroup removeCategory(CategoryNode categoryNode) {
        this.categories.remove(categoryNode);
        categoryNode.getGroups().remove(this);
        return this;
    }

    public void setCategories(Set<CategoryNode> categoryNodes) {
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
        QuestionGroup questionGroup = (QuestionGroup) o;
        if (questionGroup.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, questionGroup.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "QuestionGroup{" +
            "id=" + id +
            ", text='" + text + "'" +
            ", memo='" + memo + "'" +
            '}';
    }
}
