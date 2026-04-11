// com.efir.service.otp.OtpServiceImpl
package com.efir.service.otp;

import com.efir.entity.OtpRecord;
import com.efir.entity.User;
import com.efir.exception.InvalidOtpException;
import com.efir.exception.OtpExpiredException;
import com.efir.repository.OtpRepository;
import com.efir.repository.UserRepository;
import com.efir.security.JwtTokenProvider;
import com.efir.util.OtpGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
class OtpServiceImpl implements OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final OtpGenerator otpGenerator;
    private final OtpDeliveryStrategy otpDeliveryStrategy;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    @Transactional
    public void generateAndSendOtp(String email) {
        String otpCode = otpGenerator.generateOtp();

        OtpRecord record = OtpRecord.builder()
                .email(email)
                .otpCode(otpCode)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .used(false)
                .build();

        otpRepository.save(record);
        log.info("OTP generated for email: {}", email);

        otpDeliveryStrategy.deliver(email, otpCode);
    }

    @Override
    @Transactional
    public String verifyOtp(String email, String otp) {
        OtpRecord record = otpRepository
                .findTopByEmailAndUsedFalseOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new InvalidOtpException("No OTP found for email: " + email));

        if (record.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new OtpExpiredException("OTP has expired for email: " + email);
        }

        if (!record.getOtpCode().equals(otp)) {
            throw new InvalidOtpException("OTP does not match for email: " + email);
        }

        // Mark OTP as used
        record.setUsed(true);
        otpRepository.save(record);

        // If first verification: set user as verified
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidOtpException("User not found for email: " + email));

        if (!user.getVerified()) {
            user.setVerified(true);
            userRepository.save(user);
            log.info("User verified via OTP: {}", user.getUsername());
        }

        return jwtTokenProvider.generateToken(user.getUsername(), user.getRole().name());
    }

    /**
     * Scheduled cleanup: deletes expired or used OTP records every hour.
     */
    @Scheduled(fixedRate = 3600000)
    @Transactional
    public void cleanupExpiredOtps() {
        log.info("Running OTP cleanup task");
        otpRepository.deleteAllByExpiresAtBeforeOrUsedTrue(LocalDateTime.now());
    }
}
