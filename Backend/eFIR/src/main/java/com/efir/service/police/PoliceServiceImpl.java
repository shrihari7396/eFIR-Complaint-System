// com.efir.service.police.PoliceServiceImpl
package com.efir.service.police;

import com.efir.dto.response.ComplaintResponse;
import com.efir.dto.response.PagedComplaintsResponse;
import com.efir.entity.Complaint;
import com.efir.exception.ComplaintNotFoundException;
import com.efir.mapper.ComplaintMapper;
import com.efir.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
class PoliceServiceImpl implements PoliceService {

    private final ComplaintRepository complaintRepository;
    private final ComplaintMapper complaintMapper;

    @Override
    public PagedComplaintsResponse getAllComplaints(int pageNumber, int size) {
        Page<Complaint> page = complaintRepository.findAll(
                PageRequest.of(pageNumber, size, Sort.by(Sort.Direction.DESC, "createdAt")));

        List<ComplaintResponse> responses = complaintMapper.toResponseList(page.getContent());

        log.info("Police fetched page={} size={} total={}", pageNumber, size, page.getTotalElements());

        return PagedComplaintsResponse.builder()
                .complaints(responses)
                .total(page.getTotalElements())
                .build();
    }

    @Override
    @Transactional
    public void updateVerdict(Long complaintId, String verdict) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ComplaintNotFoundException(
                        "Complaint not found with id: " + complaintId));

        Complaint.ComplaintStatus status = Complaint.ComplaintStatus.valueOf(verdict.toUpperCase());
        complaint.setStatus(status);
        complaintRepository.save(complaint);

        log.info("Complaint {} verdict updated to {}", complaintId, status);
    }
}
