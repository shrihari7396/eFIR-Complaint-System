package com.efir.main.controller.citizen;


import com.efir.main.controller.EmailController;
import com.efir.main.model.User;
import com.efir.main.service.JwtUtil;
import com.efir.main.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailController emailController;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existingUser = userService.findByEmailOrMobile(user.getEmail(), user.getMobile())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userService.passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            String token = jwtUtil.generateToken(existingUser.getEmail());
            return ResponseEntity.ok().body(token);
        }
        throw new RuntimeException("Invalid credentials");
    }

    @PostMapping("/sendOtp")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        userService.saveOtp(email, otp);

        String subject =" Subject: Your One-Time Password (OTP) for e-FIR";
        String body = "Dear [User's Name],\n" +
                "\n" +
                "Your One-Time Password (OTP) for e-FIR is:\n" +
                "\n" +
                 otp +"\n" +
                "\n" +
                "This OTP is valid for 2 minutes. Please do not share it with anyone.\n" +
                "\n" +
                "If you did not request this OTP, please contact our support team immediately.\n" +
                "\n" +
                "Thank you,\n" +
                "e-FIR Team\n";

        emailController.sendEmail(email,subject,body);
        return ResponseEntity.ok().body("OTP sent successfully");
    }

    @PostMapping("/verifyOtp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        User user = userService.verifyOtp(email, otp);
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok().body(token);
    }
}