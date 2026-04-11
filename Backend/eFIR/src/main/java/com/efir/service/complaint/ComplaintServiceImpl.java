// com.efir.service.complaint.ComplaintServiceImpl
package com.efir.service.complaint;

import com.efir.dto.request.ComplaintRequest;
import com.efir.dto.response.ComplaintResponse;
import com.efir.entity.Complaint;
import com.efir.entity.User;
import com.efir.mapper.ComplaintMapper;
import com.efir.repository.ComplaintRepository;
import com.efir.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final ComplaintMapper complaintMapper;

    @Override
    @Transactional
    public ComplaintResponse fileComplaint(String username, ComplaintRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Complaint complaint = complaintMapper.toEntity(request);
        complaint.setUser(user);
        complaint.setStatus(Complaint.ComplaintStatus.PROCESSING);

        Complaint saved = complaintRepository.save(complaint);
        log.info("Complaint filed: id={} by user={}", saved.getId(), username);

        return complaintMapper.toResponse(saved);
    }

    @Override
    public List<ComplaintResponse> getComplaintsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<Complaint> complaints = complaintRepository.findAllByUserId(user.getId());
        log.info("Fetched {} complaints for user={}", complaints.size(), username);

        return complaintMapper.toResponseList(complaints);
    }
}
