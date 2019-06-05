package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;
import com.tj.kvasir.domain.QuestionChoiceOption;
import com.tj.kvasir.repository.QuestionChoiceOptionRepository;
import com.tj.kvasir.repository.search.QuestionChoiceOptionSearchRepository;
import com.tj.kvasir.service.QuestionChoiceOptionService;
import com.tj.kvasir.service.dto.QuestionChoiceOptionDTO;
import com.tj.kvasir.service.mapper.QuestionChoiceOptionMapper;
import com.tj.kvasir.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.tj.kvasir.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link QuestionChoiceOptionResource} REST controller.
 */
@SpringBootTest(classes = KavsirApp.class)
public class QuestionChoiceOptionResourceIT {

    private static final Boolean DEFAULT_CORRECT = false;
    private static final Boolean UPDATED_CORRECT = true;

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_MEMO = "AAAAAAAAAA";
    private static final String UPDATED_MEMO = "BBBBBBBBBB";

    @Autowired
    private QuestionChoiceOptionRepository questionChoiceOptionRepository;

    @Mock
    private QuestionChoiceOptionRepository questionChoiceOptionRepositoryMock;

    @Autowired
    private QuestionChoiceOptionMapper questionChoiceOptionMapper;

    @Mock
    private QuestionChoiceOptionService questionChoiceOptionServiceMock;

    @Autowired
    private QuestionChoiceOptionService questionChoiceOptionService;

    /**
     * This repository is mocked in the com.tj.kvasir.repository.search test package.
     *
     * @see com.tj.kvasir.repository.search.QuestionChoiceOptionSearchRepositoryMockConfiguration
     */
    @Autowired
    private QuestionChoiceOptionSearchRepository mockQuestionChoiceOptionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restQuestionChoiceOptionMockMvc;

    private QuestionChoiceOption questionChoiceOption;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuestionChoiceOptionResource questionChoiceOptionResource = new QuestionChoiceOptionResource(questionChoiceOptionService);
        this.restQuestionChoiceOptionMockMvc = MockMvcBuilders.standaloneSetup(questionChoiceOptionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QuestionChoiceOption createEntity(EntityManager em) {
        QuestionChoiceOption questionChoiceOption = new QuestionChoiceOption()
            .correct(DEFAULT_CORRECT)
            .text(DEFAULT_TEXT)
            .memo(DEFAULT_MEMO);
        return questionChoiceOption;
    }

    @BeforeEach
    public void initTest() {
        questionChoiceOption = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionChoiceOption() throws Exception {
        int databaseSizeBeforeCreate = questionChoiceOptionRepository.findAll().size();

        // Create the QuestionChoiceOption
        QuestionChoiceOptionDTO questionChoiceOptionDTO = questionChoiceOptionMapper.toDto(questionChoiceOption);
        restQuestionChoiceOptionMockMvc.perform(post("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceOptionDTO)))
            .andExpect(status().isCreated());

        // Validate the QuestionChoiceOption in the database
        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionChoiceOption testQuestionChoiceOption = questionChoiceOptionList.get(questionChoiceOptionList.size() - 1);
        assertThat(testQuestionChoiceOption.isCorrect()).isEqualTo(DEFAULT_CORRECT);
        assertThat(testQuestionChoiceOption.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testQuestionChoiceOption.getMemo()).isEqualTo(DEFAULT_MEMO);

        // Validate the QuestionChoiceOption in Elasticsearch
        verify(mockQuestionChoiceOptionSearchRepository, times(1)).save(testQuestionChoiceOption);
    }

    @Test
    @Transactional
    public void createQuestionChoiceOptionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionChoiceOptionRepository.findAll().size();

        // Create the QuestionChoiceOption with an existing ID
        questionChoiceOption.setId(1L);
        QuestionChoiceOptionDTO questionChoiceOptionDTO = questionChoiceOptionMapper.toDto(questionChoiceOption);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionChoiceOptionMockMvc.perform(post("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceOptionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionChoiceOption in the database
        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeCreate);

        // Validate the QuestionChoiceOption in Elasticsearch
        verify(mockQuestionChoiceOptionSearchRepository, times(0)).save(questionChoiceOption);
    }


    @Test
    @Transactional
    public void checkCorrectIsRequired() throws Exception {
        int databaseSizeBeforeTest = questionChoiceOptionRepository.findAll().size();
        // set the field null
        questionChoiceOption.setCorrect(null);

        // Create the QuestionChoiceOption, which fails.
        QuestionChoiceOptionDTO questionChoiceOptionDTO = questionChoiceOptionMapper.toDto(questionChoiceOption);

        restQuestionChoiceOptionMockMvc.perform(post("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceOptionDTO)))
            .andExpect(status().isBadRequest());

        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuestionChoiceOptions() throws Exception {
        // Initialize the database
        questionChoiceOptionRepository.saveAndFlush(questionChoiceOption);

        // Get all the questionChoiceOptionList
        restQuestionChoiceOptionMockMvc.perform(get("/api/question-choice-options?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionChoiceOption.getId().intValue())))
            .andExpect(jsonPath("$.[*].correct").value(hasItem(DEFAULT_CORRECT.booleanValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())));
    }

    @SuppressWarnings({"unchecked"})
    public void getAllQuestionChoiceOptionsWithEagerRelationshipsIsEnabled() throws Exception {
        QuestionChoiceOptionResource questionChoiceOptionResource = new QuestionChoiceOptionResource(questionChoiceOptionServiceMock);
        when(questionChoiceOptionServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restQuestionChoiceOptionMockMvc = MockMvcBuilders.standaloneSetup(questionChoiceOptionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restQuestionChoiceOptionMockMvc.perform(get("/api/question-choice-options?eagerload=true"))
        .andExpect(status().isOk());

        verify(questionChoiceOptionServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllQuestionChoiceOptionsWithEagerRelationshipsIsNotEnabled() throws Exception {
        QuestionChoiceOptionResource questionChoiceOptionResource = new QuestionChoiceOptionResource(questionChoiceOptionServiceMock);
            when(questionChoiceOptionServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restQuestionChoiceOptionMockMvc = MockMvcBuilders.standaloneSetup(questionChoiceOptionResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restQuestionChoiceOptionMockMvc.perform(get("/api/question-choice-options?eagerload=true"))
        .andExpect(status().isOk());

            verify(questionChoiceOptionServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getQuestionChoiceOption() throws Exception {
        // Initialize the database
        questionChoiceOptionRepository.saveAndFlush(questionChoiceOption);

        // Get the questionChoiceOption
        restQuestionChoiceOptionMockMvc.perform(get("/api/question-choice-options/{id}", questionChoiceOption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionChoiceOption.getId().intValue()))
            .andExpect(jsonPath("$.correct").value(DEFAULT_CORRECT.booleanValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.memo").value(DEFAULT_MEMO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionChoiceOption() throws Exception {
        // Get the questionChoiceOption
        restQuestionChoiceOptionMockMvc.perform(get("/api/question-choice-options/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionChoiceOption() throws Exception {
        // Initialize the database
        questionChoiceOptionRepository.saveAndFlush(questionChoiceOption);

        int databaseSizeBeforeUpdate = questionChoiceOptionRepository.findAll().size();

        // Update the questionChoiceOption
        QuestionChoiceOption updatedQuestionChoiceOption = questionChoiceOptionRepository.findById(questionChoiceOption.getId()).get();
        // Disconnect from session so that the updates on updatedQuestionChoiceOption are not directly saved in db
        em.detach(updatedQuestionChoiceOption);
        updatedQuestionChoiceOption
            .correct(UPDATED_CORRECT)
            .text(UPDATED_TEXT)
            .memo(UPDATED_MEMO);
        QuestionChoiceOptionDTO questionChoiceOptionDTO = questionChoiceOptionMapper.toDto(updatedQuestionChoiceOption);

        restQuestionChoiceOptionMockMvc.perform(put("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceOptionDTO)))
            .andExpect(status().isOk());

        // Validate the QuestionChoiceOption in the database
        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeUpdate);
        QuestionChoiceOption testQuestionChoiceOption = questionChoiceOptionList.get(questionChoiceOptionList.size() - 1);
        assertThat(testQuestionChoiceOption.isCorrect()).isEqualTo(UPDATED_CORRECT);
        assertThat(testQuestionChoiceOption.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testQuestionChoiceOption.getMemo()).isEqualTo(UPDATED_MEMO);

        // Validate the QuestionChoiceOption in Elasticsearch
        verify(mockQuestionChoiceOptionSearchRepository, times(1)).save(testQuestionChoiceOption);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionChoiceOption() throws Exception {
        int databaseSizeBeforeUpdate = questionChoiceOptionRepository.findAll().size();

        // Create the QuestionChoiceOption
        QuestionChoiceOptionDTO questionChoiceOptionDTO = questionChoiceOptionMapper.toDto(questionChoiceOption);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuestionChoiceOptionMockMvc.perform(put("/api/question-choice-options")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionChoiceOptionDTO)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionChoiceOption in the database
        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the QuestionChoiceOption in Elasticsearch
        verify(mockQuestionChoiceOptionSearchRepository, times(0)).save(questionChoiceOption);
    }

    @Test
    @Transactional
    public void deleteQuestionChoiceOption() throws Exception {
        // Initialize the database
        questionChoiceOptionRepository.saveAndFlush(questionChoiceOption);

        int databaseSizeBeforeDelete = questionChoiceOptionRepository.findAll().size();

        // Delete the questionChoiceOption
        restQuestionChoiceOptionMockMvc.perform(delete("/api/question-choice-options/{id}", questionChoiceOption.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<QuestionChoiceOption> questionChoiceOptionList = questionChoiceOptionRepository.findAll();
        assertThat(questionChoiceOptionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the QuestionChoiceOption in Elasticsearch
        verify(mockQuestionChoiceOptionSearchRepository, times(1)).deleteById(questionChoiceOption.getId());
    }

    @Test
    @Transactional
    public void searchQuestionChoiceOption() throws Exception {
        // Initialize the database
        questionChoiceOptionRepository.saveAndFlush(questionChoiceOption);
        when(mockQuestionChoiceOptionSearchRepository.search(queryStringQuery("id:" + questionChoiceOption.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(questionChoiceOption), PageRequest.of(0, 1), 1));
        // Search the questionChoiceOption
        restQuestionChoiceOptionMockMvc.perform(get("/api/_search/question-choice-options?query=id:" + questionChoiceOption.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionChoiceOption.getId().intValue())))
            .andExpect(jsonPath("$.[*].correct").value(hasItem(DEFAULT_CORRECT.booleanValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionChoiceOption.class);
        QuestionChoiceOption questionChoiceOption1 = new QuestionChoiceOption();
        questionChoiceOption1.setId(1L);
        QuestionChoiceOption questionChoiceOption2 = new QuestionChoiceOption();
        questionChoiceOption2.setId(questionChoiceOption1.getId());
        assertThat(questionChoiceOption1).isEqualTo(questionChoiceOption2);
        questionChoiceOption2.setId(2L);
        assertThat(questionChoiceOption1).isNotEqualTo(questionChoiceOption2);
        questionChoiceOption1.setId(null);
        assertThat(questionChoiceOption1).isNotEqualTo(questionChoiceOption2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionChoiceOptionDTO.class);
        QuestionChoiceOptionDTO questionChoiceOptionDTO1 = new QuestionChoiceOptionDTO();
        questionChoiceOptionDTO1.setId(1L);
        QuestionChoiceOptionDTO questionChoiceOptionDTO2 = new QuestionChoiceOptionDTO();
        assertThat(questionChoiceOptionDTO1).isNotEqualTo(questionChoiceOptionDTO2);
        questionChoiceOptionDTO2.setId(questionChoiceOptionDTO1.getId());
        assertThat(questionChoiceOptionDTO1).isEqualTo(questionChoiceOptionDTO2);
        questionChoiceOptionDTO2.setId(2L);
        assertThat(questionChoiceOptionDTO1).isNotEqualTo(questionChoiceOptionDTO2);
        questionChoiceOptionDTO1.setId(null);
        assertThat(questionChoiceOptionDTO1).isNotEqualTo(questionChoiceOptionDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(questionChoiceOptionMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(questionChoiceOptionMapper.fromId(null)).isNull();
    }
}
