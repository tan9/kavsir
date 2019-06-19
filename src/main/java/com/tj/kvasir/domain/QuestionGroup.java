package com.tj.kvasir.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * 題組
 */
@Entity
@Table(name = "question_group")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "questiongroup")
public class QuestionGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    /**
     * 題目
     */

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "text", nullable = false)
    private String text;

    /**
     * 備註
     */
    @Column(name = "memo")
    private String memo;

    @OneToMany(mappedBy = "questionGroup")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionChoice> choices = new HashSet<>();

    @OneToMany(mappedBy = "questionGroup")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionTrueFalse> trueFalses = new HashSet<>();

    @OneToMany(mappedBy = "questionGroup")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionEssay> essays = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_group_category",
               joinColumns = @JoinColumn(name = "question_group_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "id"))
    private Set<CategoryNode> categories = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
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
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof QuestionGroup)) {
            return false;
        }
        return id != null && id.equals(((QuestionGroup) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "QuestionGroup{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", memo='" + getMemo() + "'" +
            "}";
    }
}
