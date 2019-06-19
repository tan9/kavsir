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
 * 選擇題選項
 */
@Entity
@Table(name = "question_choice_option")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "questionchoiceoption")
public class QuestionChoiceOption implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    /**
     * 是否為正解
     */
    @NotNull
    @Column(name = "correct", nullable = false)
    private Boolean correct;

    /**
     * 選項內容
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

    @ManyToOne
    @JsonIgnoreProperties("questionChoiceOptions")
    private QuestionChoice questionChoice;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_choice_option_image",
               joinColumns = @JoinColumn(name = "question_choice_option_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "image_id", referencedColumnName = "id"))
    private Set<ResourceImage> images = new HashSet<>();

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
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof QuestionChoiceOption)) {
            return false;
        }
        return id != null && id.equals(((QuestionChoiceOption) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
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
