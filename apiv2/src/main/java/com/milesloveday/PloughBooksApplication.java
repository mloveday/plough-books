package com.milesloveday;

import com.milesloveday.resources.UserRoleResource;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

public class PloughBooksApplication extends Application<PloughBooksConfiguration> {

    public static void main(final String[] args) throws Exception {
        new PloughBooksApplication().run(args);
    }

    @Override
    public String getName() {
        return "PloughBooks";
    }

    @Override
    public void initialize(final Bootstrap<PloughBooksConfiguration> bootstrap) {
        // TODO: application initialization
    }

    @Override
    public void run(final PloughBooksConfiguration configuration,
                    final Environment environment) {
        DateFormat ploughBooksDateFormat = new SimpleDateFormat(configuration.getDateFormat());
        environment.getObjectMapper().setDateFormat(ploughBooksDateFormat);

        UserRoleResource userRoleResource = new UserRoleResource();
        environment.jersey().register(userRoleResource);
    }

}
