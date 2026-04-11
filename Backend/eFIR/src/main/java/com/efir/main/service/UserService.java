package com.efir.main.service;

import com.efir.main.Repository.UserRepository;
import com.efir.main.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    public PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public Optional<User> findByEmailOrMobile(String email, String mobile) {
        return userRepository.findByEmail(email).or(() -> userRepository.findByMobile(mobile));
    }

    public void saveOtp(String email, String otp) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setOtp(otp);
        userRepository.save(user);
    }

    public User verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (otp.equals(user.getOtp())) {
            user.setOtp(null); // Clear OTP after verification
            return userRepository.save(user);
        }
        throw new RuntimeException("Invalid OTP");
    }
}