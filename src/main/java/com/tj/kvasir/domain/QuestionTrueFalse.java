package com.tj.kvasir.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
 * 是非題
 */
@Entity
@Table(name = "question_true_false")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "questiontruefalse")
public class QuestionTrueFalse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    /**
     * 答案
     */
    @NotNull
    @Column(name = "correct", nullable = false)
    private Boolean correct;

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

    /**
     * 題組中序位
     */
    @Column(name = "group_position")
    private Integer groupPosition;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_true_false_category",
               joinColumns = @JoinColumn(name = "question_true_false_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "id"))
    private Set<CategoryNode> categories = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_true_false_image",
               joinColumns = @JoinColumn(name = "question_true_false_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "image_id", referencedColumnName = "id"))
    private Set<ResourceImage> images = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("questionTrueFalses")
    private QuestionGroup questionGroup;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isCorrect() {
        return correct;
    }

    public QuestionTrueFalse correct(Boolean correct) {
        this.correct = correct;
        return this;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    public String getText() {
        return text;
    }

    public QuestionTrueFalse text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getMemo() {
        return memo;
    }

    public QuestionTrueFalse memo(String memo) {
        this.memo = memo;
        return this;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public Integer getGroupPosition() {
        return groupPosition;
    }

    public QuestionTrueFalse groupPosition(Integer groupPosition) {
        this.groupPosition = groupPosition;
        return this;
    }

    public void setGroupPosition(Integer groupPosition) {
        this.groupPosition = groupPosition;
    }

    public Set<CategoryNode> getCategories() {
        return categories;
    }

    public QuestionTrueFalse categories(Set<CategoryNode> categoryNodes) {
        this.categories = categoryNodes;
        return this;
    }

    public QuestionTrueFalse addCategory(CategoryNode categoryNode) {
        this.categories.add(categoryNode);
        categoryNode.getTrueOrFalses().add(this);
        return this;
    }

    public QuestionTrueFalse removeCategory(CategoryNode categoryNode) {
        this.categories.remove(categoryNode);
        categoryNode.getTrueOrFalses().remove(this);
        return this;
    }

    public void setCategories(Set<CategoryNode> categoryNodes) {
        this.categories = categoryNodes;
    }

    public Set<ResourceImage> getImages() {
        return images;
    }

    public QuestionTrueFalse images(Set<ResourceImage> resourceImages) {
        this.images = resourceImages;
        return this;
    }

    public QuestionTrueFalse addImage(ResourceImage resourceImage) {
        this.images.add(resourceImage);
        resourceImage.getTrueFalses().add(this);
        return this;
    }

    public QuestionTrueFalse removeImage(ResourceImage resourceImage) {
        this.images.remove(resourceImage);
        resourceImage.getTrueFalses().remove(this);
        return this;
    }

    public void setImages(Set<ResourceImage> resourceImages) {
        this.images = resourceImages;
    }

    public QuestionGroup getQuestionGroup() {
        return questionGroup;
    }

    public QuestionTrueFalse questionGroup(QuestionGroup questionGroup) {
        this.questionGroup = questionGroup;
        return this;
    }

    public void setQuestionGroup(QuestionGroup questionGroup) {
        this.questionGroup = questionGroup;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof QuestionTrueFalse)) {
            return false;
        }
        return id != null && id.equals(((QuestionTrueFalse) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "QuestionTrueFalse{" +
            "id=" + getId() +
            ", correct='" + isCorrect() + "'" +
            ", text='" + getText() + "'" +
            ", memo='" + getMemo() + "'" +
            ", groupPosition=" + getGroupPosition() +
            "}";
    }
}
