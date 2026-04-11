package com.efir.main.service.Implementation;

import com.efir.main.Repository.ComplaintRepo;
import com.efir.main.Repository.PersonRepository;
import com.efir.main.Repository.UserRepository;
import com.efir.main.controller.GroqApiController;
import com.efir.main.exeptions.ComplaintNotFoundException;
import com.efir.main.exeptions.NoComplaintsFoundExceptions;
import com.efir.main.model.Complaint;
import com.efir.main.model.User;
import com.efir.main.model.complaintdata.ComplaintStatus;
import com.efir.main.model.complaintdata.IncidentDetails;
import com.efir.main.service.FetchComplainService;
import com.efir.main.utility.JsonToListConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class FetchComplainServiceImplementation implements FetchComplainService {
    @Autowired
    ComplaintRepo repo;
    @Autowired
    UserRepository userrepo;
    @Autowired
    PersonRepository personrepo;
    @Autowired
    GroqApiController apiController;
    @Autowired
    JsonToListConverter convert;

    @Override
    public Complaint fetchByFirId(String id) throws ComplaintNotFoundException {
        Complaint fetchedcomplaint = repo.findByfirId(id);
        if (fetchedcomplaint == null) {
            throw new ComplaintNotFoundException("No such Complaint exist!! ");
        } else {
            return fetchedcomplaint;
        }
    }

    @Override
    public List<Complaint> fetchAll() {
        List<Complaint> AllComplaints = repo.findAll();
        if (AllComplaints.isEmpty()) {
            throw new NoComplaintsFoundExceptions("NO Complaints in DataBase");
        } else {
            return AllComplaints;
        }
    }


//    //------------------------------------------------------------------------
//    public String generatefirid(){
//        return UUID.randomUUID().toString();
//    }

    public Complaint saveComplaint(Complaint complaint) {

        Complaint complaint1 = new Complaint();
        String Firid = complaint.getFirId();
        complaint1.setFirId(Firid);
        System.out.println(Firid);
        IncidentDetails details= complaint.getIncidentDetails();
        String incidentdetail= details.getIncidentDescription();
        String summary = apiController.callApi("generate short and accurate and to the point summary of the complaint in short paragraph grammatically correct"+" "+ incidentdetail );
       details.setIncidentDescription(summary);
        complaint1.setIncidentDetails(details);

//        System.out.println(summary);

        String prompt = summary + "\n\n" +
                "Given the following list of crime categories:\n" +
                "[\n" +
                "  \"Cognizable Offenses\",\n" +
                "  \"Non-Cognizable Offenses\",\n" +
                "  \"Bailable Offenses\",\n" +
                "  \"Non-Bailable Offenses\",\n" +
                "  \"Compoundable Offenses\",\n" +
                "  \"Non-Compoundable Offenses\",\n" +
                "  \"Offenses against Women\",\n" +
                "  \"Offenses against Children\",\n" +
                "  \"Economic Offenses\",\n" +
                "  \"Cyber Crimes\",\n" +
                "  \"Drug Offenses\",\n" +
                "  \"Environmental Offenses\",\n" +
                "  \"Traffic Offenses\",\n" +
                "  \"Property Offenses\",\n" +
                "  \"Terrorism-related Offenses\",\n" +
                "  \"White-collar Crimes\",\n" +
                "  \"Corruption Offenses\",\n" +
                "  \"Fraudulent Practices\",\n" +
                "  \"Domestic Violence Offenses\",\n" +
                "  \"Sexual Harassment Offenses\",\n" +
                "  \"Human Trafficking Offenses\",\n" +
                "  \"Intellectual Property Crimes\",\n" +
                "  \"Hate Crimes\",\n" +
                "  \"Juvenile Offenses\",\n" +
                "  \"Organized Crime\",\n" +
                "  \"Money Laundering Offenses\",\n" +
                "  \"Forgery and Counterfeiting Offenses\",\n" +
                "  \"Alcohol-related Offenses\",\n" +
                "  \"Public Order Offenses\",\n" +
                "  \"Violation of Intellectual Property Rights\",\n" +
                "  \"Cyberbullying Offenses\",\n" +
                "  \"Religious Offenses\",\n" +
                "  \"Wildlife Crimes\",\n" +
                "  \"Labour Law Violations\",\n" +
                "  \"Immigration Offenses\"\n" +
                "]\n\n" +
                "Task:\n" +
                "1. Identify which categories best fit the provided summary.\n" +
                "2. only Return the identified categories as an array and nothing.\n" +
                "3. If no categories match, return [\"Not Identified\"].";


        String crimetype = apiController.callApi(prompt);
        List<String> listcrimes = convert.convertJsonToList(crimetype);
        complaint1.setCrimeType(listcrimes);
//        System.out.println(crimetype);

        String ipcprompt = "Your task is to identify  relevant and accurate IPC sections that  apply to the given incidence description.\n\n" +
                "description:\n" + summary + "\n\n" +
                "### Task:\n" +
                "1. Analyze the given description.\n" +
                "2. Identify relevant IPC sections without any constraints or predefined lists.\n" +
                "3. Return the result strictly as a JSON array of strings containing IPC sections in the format: \"SECTION IPC\".\n\n" +
                "Example Output:\n" +
                "[\"302 IPC\", \"307 IPC\", \"376 IPC\"]\n\n" +
                "If no relevant section is found, return:\n" +
                "[\"Not Identified\"]" +
                "Your must send list of ipc codes only in return message and nothing extra";

        String ipcodes = apiController.callApi(ipcprompt);
        List<String> listipc = convert.convertJsonToList(ipcodes);
        complaint1.setIpc(listipc);
        System.out.println(listipc);

        ComplaintStatus status  = complaint.getComplaintStatus();
        Date currdate = new Date();
        status.setDate(currdate);
        complaint1.setComplaintStatus(status);

        List<String> evidences = complaint.getEvidence();
        complaint1.setEvidence(evidences);
        //-------------------------------
        User user = userrepo.findById(complaint.getFiledBy().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        complaint1.setFiledBy(user); // Attach the full User entity
        return repo.save(complaint1);
    }



   //---------------------------------------------------------------------------









    public User saveuser(User user) {
        return userrepo.save(user);
    }


}
