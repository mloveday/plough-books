package com.milesloveday;

import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

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
        // TODO: implement application
    }

}
