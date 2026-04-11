// com.efir.service.user.UserProfileServiceImpl
package com.efir.service.user;

import com.efir.dto.response.UserResponse;
import com.efir.entity.User;
import com.efir.mapper.UserMapper;
import com.efir.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
class UserProfileServiceImpl implements UserProfileService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("Profile fetch failed — user not found: {}", username);
                    return new UsernameNotFoundException("User not found: " + username);
                });
        log.info("Profile fetched for user: {}", username);
        return userMapper.toResponse(user);
    }
}
