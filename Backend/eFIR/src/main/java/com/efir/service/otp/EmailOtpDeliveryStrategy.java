// com.efir.service.otp.EmailOtpDeliveryStrategy
package com.efir.service.otp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
class EmailOtpDeliveryStrategy implements OtpDeliveryStrategy {

    private final JavaMailSender mailSender;

    @Override
    public void deliver(String recipient, String otpCode) {
        log.info("Sending OTP email to: {}", recipient);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipient);
        message.setSubject("eFIR — Your Verification Code");
        message.setText(
                "Dear User,\n\n"
                + "Your One-Time Password (OTP) for eFIR verification is: " + otpCode + "\n\n"
                + "This code is valid for 10 minutes.\n\n"
                + "If you did not request this code, please ignore this email.\n\n"
                + "Regards,\neFIR Complaint System"
        );

        mailSender.send(message);
        log.info("OTP email sent successfully to: {}", recipient);
    }
}
