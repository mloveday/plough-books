package com.milesloveday.resources;

import com.milesloveday.api.UserRole;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Collections;
import java.util.List;

@Path("user-roles")
@Produces(MediaType.APPLICATION_JSON)
public class UserRoleResource {
    @GET
    public List<UserRole> getAllUserRoles() {
        // TODO implement endpoint
        return Collections.singletonList(
                sampleUserRole(1)
        );
    }

    @GET
    @Path("{id}")
    public UserRole getUserRole(@PathParam("id") final long id) {
        // TODO implement endpoint
        return sampleUserRole(id);
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public UserRole createUserRole(@NotNull @Valid final UserRole userRole) {
        // TODO implement endpoint
        return userRole;
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public UserRole editUserRole(@NotNull @Valid final UserRole userRole) {
        // TODO implement endpoint
        return userRole;
    }

    @DELETE
    @Path("{id}")
    public String editUserRole(@PathParam("id") final int id) {
        // TODO implement endpoint
        return "OK";
    }

    private UserRole sampleUserRole(long id) {
        UserRole ur = new UserRole();
        ur.setId(id);
        ur.setRole("Admin");
        ur.setManagesUsers(true);
        return ur;
    }
}
