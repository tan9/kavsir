package com.tj.kvasir.domain;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * 問答題
 */
@ApiModel(description = "問答題")
@Entity
@Table(name = "question_essay")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "questionessay")
public class QuestionEssay implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * 題目
     */
    @NotNull
    @ApiModelProperty(value = "題目", required = true)
    @Column(name = "text", columnDefinition = "text", nullable = false)
    private String text;

    /**
     * 答案
     */
    @NotNull
    @ApiModelProperty(value = "答案", required = true)
    @Column(name = "answer", columnDefinition = "text", nullable = false)
    private String answer;

    /**
     * 備註
     */
    @ApiModelProperty(value = "備註")
    @Column(name = "memo")
    private String memo;

    /**
     * 題組中序位
     */
    @ApiModelProperty(value = "題組中序位")
    @Column(name = "group_position")
    private Integer groupPosition;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_essay_category",
               joinColumns = @JoinColumn(name="question_essays_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="categories_id", referencedColumnName="id"))
    private Set<CategoryNode> categories = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_essay_image",
               joinColumns = @JoinColumn(name="question_essays_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="images_id", referencedColumnName="id"))
    private Set<ResourceImage> images = new HashSet<>();

    @ManyToOne
    private QuestionGroup questionGroup;

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

    public QuestionEssay text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getAnswer() {
        return answer;
    }

    public QuestionEssay answer(String answer) {
        this.answer = answer;
        return this;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getMemo() {
        return memo;
    }

    public QuestionEssay memo(String memo) {
        this.memo = memo;
        return this;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public Integer getGroupPosition() {
        return groupPosition;
    }

    public QuestionEssay groupPosition(Integer groupPosition) {
        this.groupPosition = groupPosition;
        return this;
    }

    public void setGroupPosition(Integer groupPosition) {
        this.groupPosition = groupPosition;
    }

    public Set<CategoryNode> getCategories() {
        return categories;
    }

    public QuestionEssay categories(Set<CategoryNode> categoryNodes) {
        this.categories = categoryNodes;
        return this;
    }

    public QuestionEssay addCategory(CategoryNode categoryNode) {
        this.categories.add(categoryNode);
        categoryNode.getEssays().add(this);
        return this;
    }

    public QuestionEssay removeCategory(CategoryNode categoryNode) {
        this.categories.remove(categoryNode);
        categoryNode.getEssays().remove(this);
        return this;
    }

    public void setCategories(Set<CategoryNode> categoryNodes) {
        this.categories = categoryNodes;
    }

    public Set<ResourceImage> getImages() {
        return images;
    }

    public QuestionEssay images(Set<ResourceImage> resourceImages) {
        this.images = resourceImages;
        return this;
    }

    public QuestionEssay addImage(ResourceImage resourceImage) {
        this.images.add(resourceImage);
        resourceImage.getEssays().add(this);
        return this;
    }

    public QuestionEssay removeImage(ResourceImage resourceImage) {
        this.images.remove(resourceImage);
        resourceImage.getEssays().remove(this);
        return this;
    }

    public void setImages(Set<ResourceImage> resourceImages) {
        this.images = resourceImages;
    }

    public QuestionGroup getQuestionGroup() {
        return questionGroup;
    }

    public QuestionEssay questionGroup(QuestionGroup questionGroup) {
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
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        QuestionEssay questionEssay = (QuestionEssay) o;
        if (questionEssay.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionEssay.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionEssay{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", answer='" + getAnswer() + "'" +
            ", memo='" + getMemo() + "'" +
            ", groupPosition=" + getGroupPosition() +
            "}";
    }
}
