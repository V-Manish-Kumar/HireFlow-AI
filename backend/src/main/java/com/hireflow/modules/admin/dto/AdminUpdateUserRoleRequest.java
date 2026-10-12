package com.hireflow.modules.admin.dto;

import com.hireflow.modules.user.Role;
import jakarta.validation.constraints.NotNull;

public class AdminUpdateUserRoleRequest {

    @NotNull(message = "Role is required")
    private Role role;

    public AdminUpdateUserRoleRequest() {}

    public AdminUpdateUserRoleRequest(Role role) {
        this.role = role;
    }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
