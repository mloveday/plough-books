package com.milesloveday.resources;

import com.milesloveday.api.UserRole;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.Collections;
import java.util.List;

@Path("user-role")
@Produces(MediaType.APPLICATION_JSON)
public class UserRoleResource {
    @GET
    public List<UserRole> allUserRoles() {
        UserRole ur = new UserRole();
        ur.setId(1L);
        ur.setRole("Admin");
        ur.setManagesUsers(true);
        return Collections.singletonList(ur);
    }
}
