package com.hireflow.modules.admin;

import com.hireflow.common.ApiResponse;
import com.hireflow.modules.admin.dto.AdminCreateUserRequest;
import com.hireflow.modules.admin.dto.AdminUpdateUserRequest;
import com.hireflow.modules.admin.dto.AdminUpdateUserRoleRequest;
import com.hireflow.modules.auth.dto.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin User Management", description = "Privileged administrator operations for user management and access control")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    @Operation(summary = "List all platform users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = adminUserService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user details by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = adminUserService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    @PostMapping
    @Operation(summary = "Create a new user with specific role")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
        UserResponse created = adminUserService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", created));
    }

    @PutMapping("/{id}/role")
    @Operation(summary = "Update user role/access permissions")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRoleRequest request) {
        UserResponse updated = adminUserService.updateUserRole(id, request);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updated));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user profile details and credentials")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRequest request) {
        UserResponse updated = adminUserService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user account")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}
