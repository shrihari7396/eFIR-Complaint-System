// com.efir.service.auth.UserAuthServiceImpl
package com.efir.service.auth;

import com.efir.dto.request.LoginRequest;
import com.efir.entity.User;
import com.efir.exception.InvalidCredentialsException;
import com.efir.repository.UserRepository;
import com.efir.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
class UserAuthServiceImpl implements UserAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public String loginCitizen(LoginRequest request) {
        return authenticate(request, User.Role.USER);
    }

    @Override
    public String loginPolice(LoginRequest request) {
        return authenticate(request, User.Role.POLICE);
    }

    private String authenticate(LoginRequest request, User.Role expectedRole) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> {
                    log.warn("Login failed — user not found: {}", request.getUsername());
                    return new InvalidCredentialsException("Invalid username or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed — wrong password for user: {}", request.getUsername());
            throw new InvalidCredentialsException("Invalid username or password");
        }

        if (user.getRole() != expectedRole) {
            log.warn("Login failed — role mismatch for user: {} (expected={}, actual={})",
                    request.getUsername(), expectedRole, user.getRole());
            throw new InvalidCredentialsException("Invalid role for this login endpoint");
        }

        if (expectedRole == User.Role.USER && !user.getVerified()) {
            log.warn("Login failed — user not verified: {}", request.getUsername());
            throw new InvalidCredentialsException("Account not verified. Please verify via OTP.");
        }

        log.info("User authenticated: {} (role={})", user.getUsername(), user.getRole());
        return jwtTokenProvider.generateToken(user.getUsername(), user.getRole().name());
    }
}
