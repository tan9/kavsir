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
 * 圖檔
 */
@ApiModel(description = "圖檔")
@Entity
@Table(name = "resource_image")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "resourceimage")
public class ResourceImage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    /**
     * 名稱
     */
    @NotNull
    @ApiModelProperty(value = "名稱", required = true)
    @Column(name = "name", nullable = false)
    private String name;

    /**
     * 內容
     */
    @NotNull
    @ApiModelProperty(value = "內容", required = true)
    @Lob
    @Column(name = "content", nullable = false)
    private byte[] content;

    @Column(name = "content_content_type", nullable = false)
    private String contentContentType;

    @ManyToMany(mappedBy = "images")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionChoice> choices = new HashSet<>();

    @ManyToMany(mappedBy = "images")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionChoiceOption> choiceOptions = new HashSet<>();

    @ManyToMany(mappedBy = "images")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionTrueFalse> trueFalses = new HashSet<>();

    @ManyToMany(mappedBy = "images")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<QuestionEssay> essays = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public ResourceImage name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getContent() {
        return content;
    }

    public ResourceImage content(byte[] content) {
        this.content = content;
        return this;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public String getContentContentType() {
        return contentContentType;
    }

    public ResourceImage contentContentType(String contentContentType) {
        this.contentContentType = contentContentType;
        return this;
    }

    public void setContentContentType(String contentContentType) {
        this.contentContentType = contentContentType;
    }

    public Set<QuestionChoice> getChoices() {
        return choices;
    }

    public ResourceImage choices(Set<QuestionChoice> questionChoices) {
        this.choices = questionChoices;
        return this;
    }

    public ResourceImage addChoice(QuestionChoice questionChoice) {
        this.choices.add(questionChoice);
        questionChoice.getImages().add(this);
        return this;
    }

    public ResourceImage removeChoice(QuestionChoice questionChoice) {
        this.choices.remove(questionChoice);
        questionChoice.getImages().remove(this);
        return this;
    }

    public void setChoices(Set<QuestionChoice> questionChoices) {
        this.choices = questionChoices;
    }

    public Set<QuestionChoiceOption> getChoiceOptions() {
        return choiceOptions;
    }

    public ResourceImage choiceOptions(Set<QuestionChoiceOption> questionChoiceOptions) {
        this.choiceOptions = questionChoiceOptions;
        return this;
    }

    public ResourceImage addChoiceOption(QuestionChoiceOption questionChoiceOption) {
        this.choiceOptions.add(questionChoiceOption);
        questionChoiceOption.getImages().add(this);
        return this;
    }

    public ResourceImage removeChoiceOption(QuestionChoiceOption questionChoiceOption) {
        this.choiceOptions.remove(questionChoiceOption);
        questionChoiceOption.getImages().remove(this);
        return this;
    }

    public void setChoiceOptions(Set<QuestionChoiceOption> questionChoiceOptions) {
        this.choiceOptions = questionChoiceOptions;
    }

    public Set<QuestionTrueFalse> getTrueFalses() {
        return trueFalses;
    }

    public ResourceImage trueFalses(Set<QuestionTrueFalse> questionTrueFalses) {
        this.trueFalses = questionTrueFalses;
        return this;
    }

    public ResourceImage addTrueFalse(QuestionTrueFalse questionTrueFalse) {
        this.trueFalses.add(questionTrueFalse);
        questionTrueFalse.getImages().add(this);
        return this;
    }

    public ResourceImage removeTrueFalse(QuestionTrueFalse questionTrueFalse) {
        this.trueFalses.remove(questionTrueFalse);
        questionTrueFalse.getImages().remove(this);
        return this;
    }

    public void setTrueFalses(Set<QuestionTrueFalse> questionTrueFalses) {
        this.trueFalses = questionTrueFalses;
    }

    public Set<QuestionEssay> getEssays() {
        return essays;
    }

    public ResourceImage essays(Set<QuestionEssay> questionEssays) {
        this.essays = questionEssays;
        return this;
    }

    public ResourceImage addEssay(QuestionEssay questionEssay) {
        this.essays.add(questionEssay);
        questionEssay.getImages().add(this);
        return this;
    }

    public ResourceImage removeEssay(QuestionEssay questionEssay) {
        this.essays.remove(questionEssay);
        questionEssay.getImages().remove(this);
        return this;
    }

    public void setEssays(Set<QuestionEssay> questionEssays) {
        this.essays = questionEssays;
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
        ResourceImage resourceImage = (ResourceImage) o;
        if (resourceImage.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), resourceImage.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ResourceImage{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", content='" + getContent() + "'" +
            ", contentContentType='" + contentContentType + "'" +
            "}";
    }
}
