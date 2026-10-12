package com.hireflow.modules.auth.dto;

import com.hireflow.modules.user.Role;
import com.hireflow.modules.user.User;

import java.time.Instant;

public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private Role role;
    private String company;
    private Instant createdAt;

    public UserResponse() {}

    public UserResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.role = user.getRole();
        this.company = user.getCompany();
        this.createdAt = user.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
