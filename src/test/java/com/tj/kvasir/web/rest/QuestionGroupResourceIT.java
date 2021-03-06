package com.tj.kvasir.web.rest;

import com.tj.kvasir.KavsirApp;
import com.tj.kvasir.domain.QuestionGroup;
import com.tj.kvasir.repository.QuestionGroupRepository;
import com.tj.kvasir.repository.search.QuestionGroupSearchRepository;
import com.tj.kvasir.service.QuestionGroupService;
import com.tj.kvasir.service.dto.QuestionGroupDTO;
import com.tj.kvasir.service.mapper.QuestionGroupMapper;
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
 * Integration tests for the {@Link QuestionGroupResource} REST controller.
 */
@SpringBootTest(classes = KavsirApp.class)
public class QuestionGroupResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_MEMO = "AAAAAAAAAA";
    private static final String UPDATED_MEMO = "BBBBBBBBBB";

    @Autowired
    private QuestionGroupRepository questionGroupRepository;

    @Mock
    private QuestionGroupRepository questionGroupRepositoryMock;

    @Autowired
    private QuestionGroupMapper questionGroupMapper;

    @Mock
    private QuestionGroupService questionGroupServiceMock;

    @Autowired
    private QuestionGroupService questionGroupService;

    /**
     * This repository is mocked in the com.tj.kvasir.repository.search test package.
     *
     * @see com.tj.kvasir.repository.search.QuestionGroupSearchRepositoryMockConfiguration
     */
    @Autowired
    private QuestionGroupSearchRepository mockQuestionGroupSearchRepository;

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

    private MockMvc restQuestionGroupMockMvc;

    private QuestionGroup questionGroup;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuestionGroupResource questionGroupResource = new QuestionGroupResource(questionGroupService);
        this.restQuestionGroupMockMvc = MockMvcBuilders.standaloneSetup(questionGroupResource)
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
    public static QuestionGroup createEntity(EntityManager em) {
        QuestionGroup questionGroup = new QuestionGroup()
            .text(DEFAULT_TEXT)
            .memo(DEFAULT_MEMO);
        return questionGroup;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static QuestionGroup createUpdatedEntity(EntityManager em) {
        QuestionGroup questionGroup = new QuestionGroup()
            .text(UPDATED_TEXT)
            .memo(UPDATED_MEMO);
        return questionGroup;
    }

    @BeforeEach
    public void initTest() {
        questionGroup = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuestionGroup() throws Exception {
        int databaseSizeBeforeCreate = questionGroupRepository.findAll().size();

        // Create the QuestionGroup
        QuestionGroupDTO questionGroupDTO = questionGroupMapper.toDto(questionGroup);
        restQuestionGroupMockMvc.perform(post("/api/question-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionGroupDTO)))
            .andExpect(status().isCreated());

        // Validate the QuestionGroup in the database
        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeCreate + 1);
        QuestionGroup testQuestionGroup = questionGroupList.get(questionGroupList.size() - 1);
        assertThat(testQuestionGroup.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testQuestionGroup.getMemo()).isEqualTo(DEFAULT_MEMO);

        // Validate the QuestionGroup in Elasticsearch
        verify(mockQuestionGroupSearchRepository, times(1)).save(testQuestionGroup);
    }

    @Test
    @Transactional
    public void createQuestionGroupWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = questionGroupRepository.findAll().size();

        // Create the QuestionGroup with an existing ID
        questionGroup.setId(1L);
        QuestionGroupDTO questionGroupDTO = questionGroupMapper.toDto(questionGroup);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuestionGroupMockMvc.perform(post("/api/question-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionGroupDTO)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionGroup in the database
        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeCreate);

        // Validate the QuestionGroup in Elasticsearch
        verify(mockQuestionGroupSearchRepository, times(0)).save(questionGroup);
    }


    @Test
    @Transactional
    public void getAllQuestionGroups() throws Exception {
        // Initialize the database
        questionGroupRepository.saveAndFlush(questionGroup);

        // Get all the questionGroupList
        restQuestionGroupMockMvc.perform(get("/api/question-groups?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO.toString())));
    }

    @SuppressWarnings({"unchecked"})
    public void getAllQuestionGroupsWithEagerRelationshipsIsEnabled() throws Exception {
        QuestionGroupResource questionGroupResource = new QuestionGroupResource(questionGroupServiceMock);
        when(questionGroupServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restQuestionGroupMockMvc = MockMvcBuilders.standaloneSetup(questionGroupResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restQuestionGroupMockMvc.perform(get("/api/question-groups?eagerload=true"))
        .andExpect(status().isOk());

        verify(questionGroupServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllQuestionGroupsWithEagerRelationshipsIsNotEnabled() throws Exception {
        QuestionGroupResource questionGroupResource = new QuestionGroupResource(questionGroupServiceMock);
            when(questionGroupServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restQuestionGroupMockMvc = MockMvcBuilders.standaloneSetup(questionGroupResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restQuestionGroupMockMvc.perform(get("/api/question-groups?eagerload=true"))
        .andExpect(status().isOk());

            verify(questionGroupServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getQuestionGroup() throws Exception {
        // Initialize the database
        questionGroupRepository.saveAndFlush(questionGroup);

        // Get the questionGroup
        restQuestionGroupMockMvc.perform(get("/api/question-groups/{id}", questionGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(questionGroup.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.memo").value(DEFAULT_MEMO.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingQuestionGroup() throws Exception {
        // Get the questionGroup
        restQuestionGroupMockMvc.perform(get("/api/question-groups/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuestionGroup() throws Exception {
        // Initialize the database
        questionGroupRepository.saveAndFlush(questionGroup);

        int databaseSizeBeforeUpdate = questionGroupRepository.findAll().size();

        // Update the questionGroup
        QuestionGroup updatedQuestionGroup = questionGroupRepository.findById(questionGroup.getId()).get();
        // Disconnect from session so that the updates on updatedQuestionGroup are not directly saved in db
        em.detach(updatedQuestionGroup);
        updatedQuestionGroup
            .text(UPDATED_TEXT)
            .memo(UPDATED_MEMO);
        QuestionGroupDTO questionGroupDTO = questionGroupMapper.toDto(updatedQuestionGroup);

        restQuestionGroupMockMvc.perform(put("/api/question-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionGroupDTO)))
            .andExpect(status().isOk());

        // Validate the QuestionGroup in the database
        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeUpdate);
        QuestionGroup testQuestionGroup = questionGroupList.get(questionGroupList.size() - 1);
        assertThat(testQuestionGroup.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testQuestionGroup.getMemo()).isEqualTo(UPDATED_MEMO);

        // Validate the QuestionGroup in Elasticsearch
        verify(mockQuestionGroupSearchRepository, times(1)).save(testQuestionGroup);
    }

    @Test
    @Transactional
    public void updateNonExistingQuestionGroup() throws Exception {
        int databaseSizeBeforeUpdate = questionGroupRepository.findAll().size();

        // Create the QuestionGroup
        QuestionGroupDTO questionGroupDTO = questionGroupMapper.toDto(questionGroup);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuestionGroupMockMvc.perform(put("/api/question-groups")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(questionGroupDTO)))
            .andExpect(status().isBadRequest());

        // Validate the QuestionGroup in the database
        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeUpdate);

        // Validate the QuestionGroup in Elasticsearch
        verify(mockQuestionGroupSearchRepository, times(0)).save(questionGroup);
    }

    @Test
    @Transactional
    public void deleteQuestionGroup() throws Exception {
        // Initialize the database
        questionGroupRepository.saveAndFlush(questionGroup);

        int databaseSizeBeforeDelete = questionGroupRepository.findAll().size();

        // Delete the questionGroup
        restQuestionGroupMockMvc.perform(delete("/api/question-groups/{id}", questionGroup.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<QuestionGroup> questionGroupList = questionGroupRepository.findAll();
        assertThat(questionGroupList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the QuestionGroup in Elasticsearch
        verify(mockQuestionGroupSearchRepository, times(1)).deleteById(questionGroup.getId());
    }

    @Test
    @Transactional
    public void searchQuestionGroup() throws Exception {
        // Initialize the database
        questionGroupRepository.saveAndFlush(questionGroup);
        when(mockQuestionGroupSearchRepository.search(queryStringQuery("id:" + questionGroup.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(questionGroup), PageRequest.of(0, 1), 1));
        // Search the questionGroup
        restQuestionGroupMockMvc.perform(get("/api/_search/question-groups?query=id:" + questionGroup.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(questionGroup.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].memo").value(hasItem(DEFAULT_MEMO)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionGroup.class);
        QuestionGroup questionGroup1 = new QuestionGroup();
        questionGroup1.setId(1L);
        QuestionGroup questionGroup2 = new QuestionGroup();
        questionGroup2.setId(questionGroup1.getId());
        assertThat(questionGroup1).isEqualTo(questionGroup2);
        questionGroup2.setId(2L);
        assertThat(questionGroup1).isNotEqualTo(questionGroup2);
        questionGroup1.setId(null);
        assertThat(questionGroup1).isNotEqualTo(questionGroup2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuestionGroupDTO.class);
        QuestionGroupDTO questionGroupDTO1 = new QuestionGroupDTO();
        questionGroupDTO1.setId(1L);
        QuestionGroupDTO questionGroupDTO2 = new QuestionGroupDTO();
        assertThat(questionGroupDTO1).isNotEqualTo(questionGroupDTO2);
        questionGroupDTO2.setId(questionGroupDTO1.getId());
        assertThat(questionGroupDTO1).isEqualTo(questionGroupDTO2);
        questionGroupDTO2.setId(2L);
        assertThat(questionGroupDTO1).isNotEqualTo(questionGroupDTO2);
        questionGroupDTO1.setId(null);
        assertThat(questionGroupDTO1).isNotEqualTo(questionGroupDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(questionGroupMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(questionGroupMapper.fromId(null)).isNull();
    }
}
