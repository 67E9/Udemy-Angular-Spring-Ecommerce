package com.luv2code.ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class securityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        //protect endpoint /api/orders
        http.authorizeRequests(configurer ->
                    configurer
                            .antMatchers("/api/orders/**")
                            .authenticated())
                .oauth2ResourceServer()
                .jwt();

        //add cors filters
        http.cors();

        //ad content negotiation strategy
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        //force a non-empty response body for 401 to make the response user-friendly
        Okta.configureResourceServer401ResponseBody(http);

        //disable csrf because we do not use cookies for session tracking (rest api is stateless)
        http.csrf().disable();

        return http.build();
    }

}
