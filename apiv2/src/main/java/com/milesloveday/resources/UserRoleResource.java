package com.milesloveday.resources;

import com.milesloveday.api.UserRole;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Collections;

@Path("user-roles")
@Produces(MediaType.APPLICATION_JSON)
public class UserRoleResource {
    @GET
    public Response getAllUserRoles() {
        // TODO implement endpoint
        return Response.ok(
                Collections.singletonList(
                    sampleUserRole(1)
                )
            ).build();
    }

    @GET
    @Path("{id}")
    public Response getUserRole(@PathParam("id") final long id) {
        // TODO implement endpoint
        return Response.ok(sampleUserRole(id)).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createUserRole(@NotNull @Valid final UserRole userRole) {
        // TODO implement endpoint
        return Response.status(Response.Status.CREATED).entity(userRole).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Path("{id}")
    public Response editUserRole(@NotNull @Valid final UserRole userRole) {
        // TODO implement endpoint
        return Response.ok(userRole).build();
    }

    @DELETE
    @Path("{id}")
    public Response editUserRole(@PathParam("id") final int id) {
        // TODO implement endpoint
        return Response.noContent().build();
    }

    private UserRole sampleUserRole(long id) {
        UserRole ur = new UserRole();
        ur.setId(id);
        ur.setRole("Admin");
        ur.setManagesUsers(true);
        return ur;
    }
}
