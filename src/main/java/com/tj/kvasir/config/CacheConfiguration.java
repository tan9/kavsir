package com.tj.kvasir.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import org.hibernate.cache.jcache.ConfigSettings;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.tj.kvasir.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.tj.kvasir.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.tj.kvasir.domain.User.class.getName());
            createCache(cm, com.tj.kvasir.domain.Authority.class.getName());
            createCache(cm, com.tj.kvasir.domain.User.class.getName() + ".authorities");
            createCache(cm, com.tj.kvasir.domain.PersistentToken.class.getName());
            createCache(cm, com.tj.kvasir.domain.User.class.getName() + ".persistentTokens");
            createCache(cm, com.tj.kvasir.domain.CategoryAcademicYear.class.getName());
            createCache(cm, com.tj.kvasir.domain.CategoryGrade.class.getName());
            createCache(cm, com.tj.kvasir.domain.CategoryNode.class.getName());
            createCache(cm, com.tj.kvasir.domain.CategoryNode.class.getName() + ".trueOrFalses");
            createCache(cm, com.tj.kvasir.domain.CategoryNode.class.getName() + ".choices");
            createCache(cm, com.tj.kvasir.domain.CategoryNode.class.getName() + ".essays");
            createCache(cm, com.tj.kvasir.domain.CategoryNode.class.getName() + ".groups");
            createCache(cm, com.tj.kvasir.domain.CategorySemester.class.getName());
            createCache(cm, com.tj.kvasir.domain.CategorySubject.class.getName());
            createCache(cm, com.tj.kvasir.domain.QuestionChoice.class.getName());
            createCache(cm, com.tj.kvasir.domain.QuestionChoice.class.getName() + ".options");
            createCache(cm, com.tj.kvasir.domain.QuestionChoice.class.getName() + ".categories");
            createCache(cm, com.tj.kvasir.domain.QuestionChoice.class.getName() + ".images");
            createCache(cm, com.tj.kvasir.domain.QuestionChoiceOption.class.getName());
            createCache(cm, com.tj.kvasir.domain.QuestionChoiceOption.class.getName() + ".images");
            createCache(cm, com.tj.kvasir.domain.QuestionEssay.class.getName());
            createCache(cm, com.tj.kvasir.domain.QuestionEssay.class.getName() + ".categories");
            createCache(cm, com.tj.kvasir.domain.QuestionEssay.class.getName() + ".images");
            createCache(cm, com.tj.kvasir.domain.QuestionGroup.class.getName());
            createCache(cm, com.tj.kvasir.domain.QuestionGroup.class.getName() + ".choices");
            createCache(cm, com.tj.kvasir.domain.QuestionGroup.class.getName() + ".trueFalses");
            createCache(cm, com.tj.kvasir.domain.QuestionGroup.class.getName() + ".essays");
            createCache(cm, com.tj.kvasir.domain.QuestionGroup.class.getName() + ".categories");
            createCache(cm, com.tj.kvasir.domain.QuestionTrueFalse.class.getName());
            createCache(cm, com.tj.kvasir.domain.QuestionTrueFalse.class.getName() + ".categories");
            createCache(cm, com.tj.kvasir.domain.QuestionTrueFalse.class.getName() + ".images");
            createCache(cm, com.tj.kvasir.domain.ResourceImage.class.getName());
            createCache(cm, com.tj.kvasir.domain.ResourceImage.class.getName() + ".choices");
            createCache(cm, com.tj.kvasir.domain.ResourceImage.class.getName() + ".choiceOptions");
            createCache(cm, com.tj.kvasir.domain.ResourceImage.class.getName() + ".trueFalses");
            createCache(cm, com.tj.kvasir.domain.ResourceImage.class.getName() + ".essays");
            createCache(cm, com.tj.kvasir.domain.CategorySource.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cm.destroyCache(cacheName);
        }
        cm.createCache(cacheName, jcacheConfiguration);
    }
}
