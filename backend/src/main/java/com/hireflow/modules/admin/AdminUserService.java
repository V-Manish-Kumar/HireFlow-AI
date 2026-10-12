package com.hireflow.modules.admin;

import com.hireflow.common.BadRequestException;
import com.hireflow.common.ResourceNotFoundException;
import com.hireflow.modules.admin.dto.AdminCreateUserRequest;
import com.hireflow.modules.admin.dto.AdminUpdateUserRequest;
import com.hireflow.modules.admin.dto.AdminUpdateUserRoleRequest;
import com.hireflow.modules.audit.AuditService;
import com.hireflow.modules.auth.dto.UserResponse;
import com.hireflow.modules.user.Role;
import com.hireflow.modules.user.User;
import com.hireflow.modules.user.UserRepository;
import com.hireflow.modules.user.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public AdminUserService(UserRepository userRepository,
                            UserService userService,
                            PasswordEncoder passwordEncoder,
                            AuditService auditService) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(UserResponse::new)
                .toList();
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse createUser(AdminCreateUserRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already registered: " + email);
        }

        User currentUser = userService.getCurrentUser();

        User newUser = new User(
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                request.getRole() != null ? request.getRole() : Role.RECRUITER,
                request.getCompany() != null ? request.getCompany().trim() : null
        );

        User saved = userRepository.save(newUser);

        auditService.recordEvent(
                currentUser,
                "ADMIN_CREATE_USER",
                "USER",
                saved.getId(),
                "Created user account " + saved.getEmail() + " with role " + saved.getRole()
        );

        return new UserResponse(saved);
    }

    @Transactional
    public UserResponse updateUserRole(Long id, AdminUpdateUserRoleRequest request) {
        User currentUser = userService.getCurrentUser();
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (currentUser.getId().equals(id) && request.getRole() != Role.ADMIN) {
            throw new BadRequestException("You cannot revoke your own administrator privileges.");
        }

        Role oldRole = targetUser.getRole();
        targetUser.setRole(request.getRole());
        User saved = userRepository.save(targetUser);

        auditService.recordEvent(
                currentUser,
                "ADMIN_CHANGE_ROLE",
                "USER",
                saved.getId(),
                "Changed role of " + saved.getEmail() + " from " + oldRole + " to " + saved.getRole()
        );

        return new UserResponse(saved);
    }

    @Transactional
    public UserResponse updateUser(Long id, AdminUpdateUserRequest request) {
        User currentUser = userService.getCurrentUser();
        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        String email = request.getEmail().toLowerCase().trim();
        if (!targetUser.getEmail().equalsIgnoreCase(email) && userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already registered by another user: " + email);
        }

        if (currentUser.getId().equals(id) && request.getRole() != Role.ADMIN) {
            throw new BadRequestException("You cannot revoke your own administrator privileges.");
        }

        targetUser.setFullName(request.getFullName().trim());
        targetUser.setEmail(email);
        targetUser.setRole(request.getRole());
        targetUser.setCompany(request.getCompany() != null ? request.getCompany().trim() : null);

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            targetUser.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
        }

        User saved = userRepository.save(targetUser);

        auditService.recordEvent(
                currentUser,
                "ADMIN_UPDATE_USER",
                "USER",
                saved.getId(),
                "Updated details for user " + saved.getEmail()
        );

        return new UserResponse(saved);
    }

    @Transactional
    public void deleteUser(Long id) {
        User currentUser = userService.getCurrentUser();
        if (currentUser.getId().equals(id)) {
            throw new BadRequestException("You cannot delete your own active administrator account.");
        }

        User targetUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (targetUser.getRole() == Role.ADMIN && userRepository.countByRole(Role.ADMIN) <= 1) {
            throw new BadRequestException("Cannot delete the only remaining administrator account.");
        }

        userRepository.delete(targetUser);

        auditService.recordEvent(
                currentUser,
                "ADMIN_DELETE_USER",
                "USER",
                id,
                "Deleted account: " + targetUser.getEmail() + " (" + targetUser.getFullName() + ")"
        );
    }
}
