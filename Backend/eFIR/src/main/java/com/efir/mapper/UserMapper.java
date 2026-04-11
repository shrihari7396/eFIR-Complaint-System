// com.efir.mapper.UserMapper
package com.efir.mapper;

import com.efir.dto.request.RegisterRequest;
import com.efir.dto.response.UserResponse;
import com.efir.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "verified", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "street", source = "address.street")
    @Mapping(target = "city", source = "address.city")
    @Mapping(target = "state", source = "address.state")
    @Mapping(target = "zip", source = "address.zip")
    @Mapping(target = "country", source = "address.country")
    @Mapping(target = "role", ignore = true)
    User toEntity(RegisterRequest request);

    @Mapping(target = "role", expression = "java(user.getRole().name())")
    UserResponse toResponse(User user);
}
