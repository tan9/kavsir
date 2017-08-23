package com.tj.kvasir.domain;

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
 * 選擇題選項
 */
@ApiModel(description = "選擇題選項")
@Entity
@Table(name = "question_choice_option")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "questionchoiceoption")
public class QuestionChoiceOption implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * 是否為正解
     */
    @NotNull
    @ApiModelProperty(value = "是否為正解", required = true)
    @Column(name = "correct", nullable = false)
    private Boolean correct;

    /**
     * 選項內容
     */
    @NotNull
    @ApiModelProperty(value = "選項內容", required = true)
    @Lob
    @Column(name = "text", nullable = false)
    private String text;

    /**
     * 備註
     */
    @ApiModelProperty(value = "備註")
    @Column(name = "memo")
    private String memo;

    @ManyToOne
    private QuestionChoice questionChoice;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_choice_option_image",
               joinColumns = @JoinColumn(name="question_choice_options_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="images_id", referencedColumnName="id"))
    private Set<ResourceImage> images = new HashSet<>();

    // jhipster-needle-entity-add-field - Jhipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean isCorrect() {
        return correct;
    }

    public QuestionChoiceOption correct(Boolean correct) {
        this.correct = correct;
        return this;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }

    public String getText() {
        return text;
    }

    public QuestionChoiceOption text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getMemo() {
        return memo;
    }

    public QuestionChoiceOption memo(String memo) {
        this.memo = memo;
        return this;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public QuestionChoice getQuestionChoice() {
        return questionChoice;
    }

    public QuestionChoiceOption questionChoice(QuestionChoice questionChoice) {
        this.questionChoice = questionChoice;
        return this;
    }

    public void setQuestionChoice(QuestionChoice questionChoice) {
        this.questionChoice = questionChoice;
    }

    public Set<ResourceImage> getImages() {
        return images;
    }

    public QuestionChoiceOption images(Set<ResourceImage> resourceImages) {
        this.images = resourceImages;
        return this;
    }

    public QuestionChoiceOption addImage(ResourceImage resourceImage) {
        this.images.add(resourceImage);
        resourceImage.getChoiceOptions().add(this);
        return this;
    }

    public QuestionChoiceOption removeImage(ResourceImage resourceImage) {
        this.images.remove(resourceImage);
        resourceImage.getChoiceOptions().remove(this);
        return this;
    }

    public void setImages(Set<ResourceImage> resourceImages) {
        this.images = resourceImages;
    }
    // jhipster-needle-entity-add-getters-setters - Jhipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        QuestionChoiceOption questionChoiceOption = (QuestionChoiceOption) o;
        if (questionChoiceOption.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionChoiceOption.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionChoiceOption{" +
            "id=" + getId() +
            ", correct='" + isCorrect() + "'" +
            ", text='" + getText() + "'" +
            ", memo='" + getMemo() + "'" +
            "}";
    }
}
