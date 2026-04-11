// com.efir.util.RoleValidator
package com.efir.util;

import com.efir.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleValidator {

    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Checks whether the JWT token carries the expected role.
     */
    public boolean hasRole(String token, String expectedRole) {
        String role = jwtTokenProvider.getRoleFromToken(token);
        return expectedRole.equalsIgnoreCase(role);
    }
}
