package com.tj.kvasir.config;

import io.github.jhipster.config.JHipsterProperties;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.expiry.Duration;
import org.ehcache.expiry.Expirations;
import org.ehcache.jsr107.Eh107Configuration;

import java.util.concurrent.TimeUnit;

import org.springframework.boot.autoconfigure.AutoConfigureAfter;
import org.springframework.boot.autoconfigure.AutoConfigureBefore;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
@AutoConfigureAfter(value = { MetricsConfiguration.class })
@AutoConfigureBefore(value = { WebConfigurer.class, DatabaseConfiguration.class })
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(Expirations.timeToLiveExpiration(Duration.of(ehcache.getTimeToLiveSeconds(), TimeUnit.SECONDS)))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache("users", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.PersistentToken.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.User.class.getName() + ".persistentTokens", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionChoice.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionChoice.class.getName() + ".options", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionChoice.class.getName() + ".categories", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionChoice.class.getName() + ".images", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.CategoryAcademicYear.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.CategoryNode.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.CategoryNode.class.getName() + ".trueOrFalses", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.CategoryNode.class.getName() + ".choices", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.CategoryNode.class.getName() + ".essays", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.CategoryNode.class.getName() + ".groups", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.CategorySource.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.CategorySemester.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.CategorySubject.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.CategoryGrade.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionChoiceOption.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionChoiceOption.class.getName() + ".images", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionEssay.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionEssay.class.getName() + ".categories", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionEssay.class.getName() + ".images", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionGroup.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionGroup.class.getName() + ".choices", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionGroup.class.getName() + ".trueFalses", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionGroup.class.getName() + ".essays", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionGroup.class.getName() + ".categories", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionTrueFalse.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionTrueFalse.class.getName() + ".categories", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.QuestionTrueFalse.class.getName() + ".images", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.ResourceImage.class.getName(), jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.ResourceImage.class.getName() + ".choices", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.ResourceImage.class.getName() + ".choiceOptions", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.ResourceImage.class.getName() + ".trueFalses", jcacheConfiguration);
            cm.createCache(com.tj.kvasir.domain.ResourceImage.class.getName() + ".essays", jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
