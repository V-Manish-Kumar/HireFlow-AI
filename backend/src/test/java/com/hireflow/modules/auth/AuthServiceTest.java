package com.hireflow.modules.auth;

import com.hireflow.common.BadRequestException;
import com.hireflow.config.JwtTokenProvider;
import com.hireflow.modules.auth.dto.AuthRequest;
import com.hireflow.modules.auth.dto.AuthResponse;
import com.hireflow.modules.auth.dto.RegisterRequest;
import com.hireflow.modules.user.Role;
import com.hireflow.modules.user.User;
import com.hireflow.modules.user.UserRepository;
import com.hireflow.modules.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JwtTokenProvider tokenProvider;
    private UserService userService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        authenticationManager = mock(AuthenticationManager.class);
        tokenProvider = mock(JwtTokenProvider.class);
        userService = mock(UserService.class);

        authService = new AuthService(userRepository, passwordEncoder, authenticationManager, tokenProvider, userService);
    }

    @Test
    @DisplayName("Registers new user and returns JWT token")
    void testRegisterSuccess() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("newuser@example.com");
        req.setPassword("secret123");
        req.setFullName("New User");
        req.setCompany("Acme Corp");
        req.setRole(Role.RECRUITER);

        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(10L);
            return u;
        });
        when(tokenProvider.generateToken(10L, "newuser@example.com", "RECRUITER")).thenReturn("mock-jwt-token");

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        assertEquals("mock-jwt-token", res.getToken());
        assertEquals("newuser@example.com", res.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Throws BadRequestException when attempting to register duplicate email")
    void testRegisterDuplicateEmail() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("existing@example.com");
        req.setPassword("secret123");
        req.setFullName("Existing User");

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(req));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Authenticates valid credentials and generates token")
    void testLoginSuccess() {
        AuthRequest req = new AuthRequest("user@example.com", "password");
        User user = new User("user@example.com", "encodedPassword", "Test User", Role.RECRUITER, "Acme");
        user.setId(5L);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(mock(Authentication.class));
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(tokenProvider.generateToken(5L, "user@example.com", "RECRUITER")).thenReturn("jwt-success");

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertEquals("jwt-success", res.getToken());
        assertEquals("Test User", res.getUser().getFullName());
    }
}
