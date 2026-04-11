// com.efir.EfirApplication
package com.efir;

import com.efir.entity.User;
import com.efir.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@SpringBootApplication
@EnableScheduling
public class EfirApplication {

    public static void main(String[] args) {
        SpringApplication.run(EfirApplication.class, args);
    }

    /**
     * Seeds a police test account on startup if it doesn't already exist.
     * Configured via application.properties (efir.police.seed.*).
     */
    @Bean
    CommandLineRunner seedPoliceAccount(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            org.springframework.core.env.Environment env) {

        return args -> {
            String username = env.getProperty("efir.police.seed.username", "admin_police");
            String email = env.getProperty("efir.police.seed.email", "police@efir.gov.in");

            if (userRepository.existsByUsername(username)) {
                log.info("Police seed account already exists: {}", username);
                return;
            }

            String password = env.getProperty("efir.police.seed.password", "Police@123");
            String firstName = env.getProperty("efir.police.seed.firstName", "Admin");
            String lastName = env.getProperty("efir.police.seed.lastName", "Police");

            User policeUser = User.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .firstName(firstName)
                    .lastName(lastName)
                    .role(User.Role.POLICE)
                    .verified(true)
                    .build();

            userRepository.save(policeUser);
            log.info("Police seed account created: {} ({})", username, email);
        };
    }
}
