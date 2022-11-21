package com.luv2code.ecommerce.config;

import com.luv2code.ecommerce.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Value("${allowed.origins}") //populated via application.properties
    private String[] theAllowedOrigins;
    private EntityManager entityManager;

    @Override
    public void configureRepositoryRestConfiguration (RepositoryRestConfiguration config, CorsRegistry cors){

        HttpMethod[] theUnsupportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        //disable HTTP POST, PUT, DELETE for Products, ProductCategories, Countries, States
        disableActions(Product.class, config, theUnsupportedActions);
        disableActions(ProductCategory.class, config, theUnsupportedActions);
        disableActions(Country.class, config, theUnsupportedActions);
        disableActions(State.class, config, theUnsupportedActions);
        disableActions(Order.class, config, theUnsupportedActions);

        exposeIds(config);

        //set cross-origin mappings for spring data rest (cors for rest controllers is in MyAppConfig)
        cors.addMapping( config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);

    }

    private static void disableActions(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)));
    }

    @Autowired
    public MyDataRestConfig (EntityManager theEntityManager){
        entityManager = theEntityManager;

    }

    private void exposeIds(RepositoryRestConfiguration config){
        //expose entity ids dynamically, so that other classes in the future will also have exposed ids
        //

        //get a list of all entity classes from entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        //get the entity types for the entities

        for (EntityType theEntityType: entities){
            entityClasses.add(theEntityType.getJavaType());
        }

        // expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
