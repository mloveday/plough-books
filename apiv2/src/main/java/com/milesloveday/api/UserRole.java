package com.milesloveday.api;

public class UserRole {
    private long id;
    private String role;
    private Boolean managesUsers;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getManagesUsers() {
        return managesUsers;
    }

    public void setManagesUsers(Boolean managesUsers) {
        this.managesUsers = managesUsers;
    }
}
