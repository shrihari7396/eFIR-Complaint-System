// com.efir.controller.UserController
package com.efir.controller;

import com.efir.dto.request.LoginRequest;
import com.efir.dto.request.RegisterRequest;
import com.efir.dto.response.UserResponse;
import com.efir.repository.UserRepository;
import com.efir.security.JwtTokenProvider;
import com.efir.service.auth.UserAuthService;
import com.efir.service.auth.UserRegistrationService;
import com.efir.service.otp.OtpService;
import com.efir.service.user.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRegistrationService userRegistrationService;
    private final UserAuthService userAuthService;
    private final UserProfileService userProfileService;
    private final OtpService otpService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    // ========================= 1. POST /user/register =========================

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = userRegistrationService.register(request);
        return ResponseEntity.ok(response);
    }

    // ========================= 2. POST /user/login =========================

    @PostMapping(value = "/login", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> loginCitizen(@Valid @RequestBody LoginRequest request) {
        String jwt = userAuthService.loginCitizen(request);
        return ResponseEntity.ok(jwt);
    }

    // ========================= 3. POST /user/login/police =========================

    @PostMapping(value = "/login/police", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> loginPolice(@Valid @RequestBody LoginRequest request) {
        String jwt = userAuthService.loginPolice(request);
        return ResponseEntity.ok(jwt);
    }

    // ========================= 4. POST /user/sendOtp (+ /user/sendotp) =========================

    @PostMapping({"/sendOtp", "/sendotp"})
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        boolean userExists = userRepository.existsByEmail(email);
        if (!userExists) {
            return ResponseEntity.status(405).body("User with this email does not exist");
        }
        otpService.generateAndSendOtp(email);
        return ResponseEntity.ok("OTP sent successfully");
    }

    // ========================= 5. POST /user/verifyOtp =========================

    @PostMapping(value = "/verifyOtp", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> verifyOtp(@RequestParam String email,
                                            @RequestParam String otp) {
        String jwt = otpService.verifyOtp(email, otp);
        return ResponseEntity.ok(jwt);
    }

    // ========================= 6. GET /user/get =========================

    @GetMapping("/get")
    public ResponseEntity<UserResponse> getUser(
            @RequestParam(value = "token", required = false) String tokenParam,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        String token = resolveToken(tokenParam, authHeader);
        if (token == null) {
            return ResponseEntity.badRequest().build();
        }

        String username = jwtTokenProvider.getUsernameFromToken(token);
        UserResponse response = userProfileService.getUserByUsername(username);
        return ResponseEntity.ok(response);
    }

    private String resolveToken(String tokenParam, String authHeader) {
        if (StringUtils.hasText(tokenParam)) {
            return tokenParam;
        }
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
