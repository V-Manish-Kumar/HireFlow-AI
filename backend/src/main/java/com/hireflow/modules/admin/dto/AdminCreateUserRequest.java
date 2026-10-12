package com.hireflow.modules.admin.dto;

import com.hireflow.modules.user.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class AdminCreateUserRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 4, message = "Password must be at least 4 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Role is required")
    private Role role = Role.RECRUITER;

    private String company;

    public AdminCreateUserRequest() {}

    public AdminCreateUserRequest(String email, String password, String fullName, Role role, String company) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.role = role;
        this.company = company;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
}
