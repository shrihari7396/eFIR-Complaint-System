// com.efir.service.auth.UserRegistrationServiceImpl
package com.efir.service.auth;

import com.efir.dto.request.RegisterRequest;
import com.efir.dto.response.UserResponse;
import com.efir.entity.User;
import com.efir.exception.UserAlreadyExistsException;
import com.efir.mapper.UserMapper;
import com.efir.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
class UserRegistrationServiceImpl implements UserRegistrationService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException(
                    "Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "Email already registered: " + request.getEmail());
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerified(false);

        // Set role — default to USER
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("POLICE")) {
            user.setRole(User.Role.POLICE);
        } else {
            user.setRole(User.Role.USER);
        }

        User saved = userRepository.save(user);
        log.info("User registered: {}", saved.getUsername());

        return userMapper.toResponse(saved);
    }
}
