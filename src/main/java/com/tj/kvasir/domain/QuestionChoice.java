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
 * 選擇題
 */
@ApiModel(description = "選擇題")
@Entity
@Table(name = "question_choice")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "questionchoice")
public class QuestionChoice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * 是否為複選
     */
    @NotNull
    @ApiModelProperty(value = "是否為複選", required = true)
    @Column(name = "multiple_response", nullable = false)
    private Boolean multipleResponse;

    /**
     * 題目
     */
    @NotNull
    @ApiModelProperty(value = "題目", required = true)
    @Lob
    @Column(name = "text", nullable = false)
    private String text;

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

    @OneToMany(mappedBy = "questionChoice")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionChoiceOption> options = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_choice_category",
               joinColumns = @JoinColumn(name="question_choices_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="categories_id", referencedColumnName="id"))
    private Set<CategoryNode> categories = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_choice_image",
               joinColumns = @JoinColumn(name="question_choices_id", referencedColumnName="id"),
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

    public Boolean isMultipleResponse() {
        return multipleResponse;
    }

    public QuestionChoice multipleResponse(Boolean multipleResponse) {
        this.multipleResponse = multipleResponse;
        return this;
    }

    public void setMultipleResponse(Boolean multipleResponse) {
        this.multipleResponse = multipleResponse;
    }

    public String getText() {
        return text;
    }

    public QuestionChoice text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getMemo() {
        return memo;
    }

    public QuestionChoice memo(String memo) {
        this.memo = memo;
        return this;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public Integer getGroupPosition() {
        return groupPosition;
    }

    public QuestionChoice groupPosition(Integer groupPosition) {
        this.groupPosition = groupPosition;
        return this;
    }

    public void setGroupPosition(Integer groupPosition) {
        this.groupPosition = groupPosition;
    }

    public Set<QuestionChoiceOption> getOptions() {
        return options;
    }

    public QuestionChoice options(Set<QuestionChoiceOption> questionChoiceOptions) {
        this.options = questionChoiceOptions;
        return this;
    }

    public QuestionChoice addOption(QuestionChoiceOption questionChoiceOption) {
        this.options.add(questionChoiceOption);
        questionChoiceOption.setQuestionChoice(this);
        return this;
    }

    public QuestionChoice removeOption(QuestionChoiceOption questionChoiceOption) {
        this.options.remove(questionChoiceOption);
        questionChoiceOption.setQuestionChoice(null);
        return this;
    }

    public void setOptions(Set<QuestionChoiceOption> questionChoiceOptions) {
        this.options = questionChoiceOptions;
    }

    public Set<CategoryNode> getCategories() {
        return categories;
    }

    public QuestionChoice categories(Set<CategoryNode> categoryNodes) {
        this.categories = categoryNodes;
        return this;
    }

    public QuestionChoice addCategory(CategoryNode categoryNode) {
        this.categories.add(categoryNode);
        categoryNode.getChoices().add(this);
        return this;
    }

    public QuestionChoice removeCategory(CategoryNode categoryNode) {
        this.categories.remove(categoryNode);
        categoryNode.getChoices().remove(this);
        return this;
    }

    public void setCategories(Set<CategoryNode> categoryNodes) {
        this.categories = categoryNodes;
    }

    public Set<ResourceImage> getImages() {
        return images;
    }

    public QuestionChoice images(Set<ResourceImage> resourceImages) {
        this.images = resourceImages;
        return this;
    }

    public QuestionChoice addImage(ResourceImage resourceImage) {
        this.images.add(resourceImage);
        resourceImage.getChoices().add(this);
        return this;
    }

    public QuestionChoice removeImage(ResourceImage resourceImage) {
        this.images.remove(resourceImage);
        resourceImage.getChoices().remove(this);
        return this;
    }

    public void setImages(Set<ResourceImage> resourceImages) {
        this.images = resourceImages;
    }

    public QuestionGroup getQuestionGroup() {
        return questionGroup;
    }

    public QuestionChoice questionGroup(QuestionGroup questionGroup) {
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
        QuestionChoice questionChoice = (QuestionChoice) o;
        if (questionChoice.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionChoice.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionChoice{" +
            "id=" + getId() +
            ", multipleResponse='" + isMultipleResponse() + "'" +
            ", text='" + getText() + "'" +
            ", memo='" + getMemo() + "'" +
            ", groupPosition='" + getGroupPosition() + "'" +
            "}";
    }
}
