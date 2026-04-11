// com.efir.mapper.ComplaintMapper
package com.efir.mapper;

import com.efir.dto.request.ComplaintRequest;
import com.efir.dto.response.ComplaintResponse;
import com.efir.entity.Address;
import com.efir.entity.Complaint;
import com.efir.entity.Incidence;
import com.efir.entity.Person;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ComplaintMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "victim", source = "victim", qualifiedByName = "toPersonEntity")
    @Mapping(target = "accused", source = "accused", qualifiedByName = "toPersonEntity")
    @Mapping(target = "incidence", source = "incidence", qualifiedByName = "toIncidenceEntity")
    Complaint toEntity(ComplaintRequest request);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "status", expression = "java(complaint.getStatus().name())")
    @Mapping(target = "victim", source = "victim", qualifiedByName = "toPersonDto")
    @Mapping(target = "accused", source = "accused", qualifiedByName = "toPersonDto")
    @Mapping(target = "incidence", source = "incidence", qualifiedByName = "toIncidenceDto")
    @Mapping(target = "createdAt", expression = "java(complaint.getCreatedAt() != null ? complaint.getCreatedAt().toString() : null)")
    ComplaintResponse toResponse(Complaint complaint);

    List<ComplaintResponse> toResponseList(List<Complaint> complaints);

    // ---- Person mapping ----

    @Named("toPersonEntity")
    default Person toPersonEntity(ComplaintRequest.PersonDto dto) {
        if (dto == null) return null;
        return Person.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .phone(dto.getPhone())
                .address(toAddressEntity(dto.getAddress()))
                .build();
    }

    @Named("toPersonDto")
    default ComplaintRequest.PersonDto toPersonDto(Person person) {
        if (person == null) return null;
        return ComplaintRequest.PersonDto.builder()
                .firstName(person.getFirstName())
                .lastName(person.getLastName())
                .phone(person.getPhone())
                .address(toAddressDto(person.getAddress()))
                .build();
    }

    // ---- Incidence mapping ----

    @Named("toIncidenceEntity")
    default Incidence toIncidenceEntity(ComplaintRequest.IncidenceDto dto) {
        if (dto == null) return null;
        LocalDate date = null;
        LocalTime time = null;
        if (dto.getDate() != null && !dto.getDate().isBlank()) {
            date = LocalDate.parse(dto.getDate());
        }
        if (dto.getTime() != null && !dto.getTime().isBlank()) {
            time = LocalTime.parse(dto.getTime());
        }
        return Incidence.builder()
                .date(date)
                .time(time)
                .description(dto.getDescription())
                .crimeType(dto.getCrimeType())
                .address(toAddressEntity(dto.getAddress()))
                .build();
    }

    @Named("toIncidenceDto")
    default ComplaintRequest.IncidenceDto toIncidenceDto(Incidence incidence) {
        if (incidence == null) return null;
        return ComplaintRequest.IncidenceDto.builder()
                .date(incidence.getDate() != null ? incidence.getDate().toString() : null)
                .time(incidence.getTime() != null ? incidence.getTime().format(DateTimeFormatter.ofPattern("HH:mm")) : null)
                .description(incidence.getDescription())
                .crimeType(incidence.getCrimeType())
                .address(toAddressDto(incidence.getAddress()))
                .build();
    }

    // ---- Address mapping ----

    default Address toAddressEntity(ComplaintRequest.AddressDto dto) {
        if (dto == null) return null;
        return Address.builder()
                .street(dto.getStreet())
                .city(dto.getCity())
                .state(dto.getState())
                .zip(dto.getZip())
                .country(dto.getCountry())
                .build();
    }

    default ComplaintRequest.AddressDto toAddressDto(Address address) {
        if (address == null) return null;
        return ComplaintRequest.AddressDto.builder()
                .street(address.getStreet())
                .city(address.getCity())
                .state(address.getState())
                .zip(address.getZip())
                .country(address.getCountry())
                .build();
    }
}
