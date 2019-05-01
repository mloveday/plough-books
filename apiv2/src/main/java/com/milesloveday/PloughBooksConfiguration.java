package com.milesloveday;

import io.dropwizard.Configuration;
import org.hibernate.validator.constraints.NotEmpty;

public class PloughBooksConfiguration extends Configuration {
    @NotEmpty
    private String dateFormat;

    public String getDateFormat() {
        return dateFormat;
    }
}
