package com.hireflow.modules.auth;

import com.hireflow.common.BadRequestException;
import com.hireflow.config.JwtTokenProvider;
import com.hireflow.modules.auth.dto.AuthRequest;
import com.hireflow.modules.auth.dto.AuthResponse;
import com.hireflow.modules.auth.dto.RegisterRequest;
import com.hireflow.modules.auth.dto.UserResponse;
import com.hireflow.modules.user.Role;
import com.hireflow.modules.user.User;
import com.hireflow.modules.user.UserRepository;
import com.hireflow.modules.user.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userService = userService;
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.getPassword())
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        String token = tokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, new UserResponse(user));
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email already registered: " + email);
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setRole(request.getRole() != null ? request.getRole() : Role.RECRUITER);
        user.setCompany(request.getCompany() != null ? request.getCompany().trim() : null);

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateToken(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());
        return new AuthResponse(token, new UserResponse(savedUser));
    }

    public UserResponse getCurrentUser() {
        User user = userService.getCurrentUser();
        return new UserResponse(user);
    }
}
