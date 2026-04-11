package com.efir.main.Repository;

import com.efir.main.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintRepo extends JpaRepository<Complaint,Integer> {
     Complaint findByfirId(String firid);
}

