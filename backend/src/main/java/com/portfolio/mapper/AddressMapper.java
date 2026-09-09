package com.portfolio.mapper;

import com.portfolio.backend.domain.Address;
import com.portfolio.backend.domain.Profile;
import com.portfolio.backend.dto.address.AddressRequestDTO;
import com.portfolio.backend.dto.address.AddressResponseDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AddressMapper {

    public Address toEntity(AddressRequestDTO dto, Profile profile) {
        return Address.builder()
                .profile(profile)
                .type(dto.type())
                .street(dto.street())
                .number(dto.number())
                .complement(dto.complement())
                .neighborhood(dto.neighborhood())
                .city(dto.city())
                .state(dto.state())
                .country(dto.country())
                .zipCode(dto.zipCode())
                .primaryAddress(dto.primaryAddress())
                .build();
    }

    public void updateEntityFromDto(AddressRequestDTO dto, Address address) {
        address.setType(dto.type());
        address.setStreet(dto.street());
        address.setNumber(dto.number());
        address.setComplement(dto.complement());
        address.setNeighborhood(dto.neighborhood());
        address.setCity(dto.city());
        address.setState(dto.state());
        address.setCountry(dto.country());
        address.setZipCode(dto.zipCode());
        address.setPrimaryAddress(dto.primaryAddress());
    }

    public AddressResponseDTO toResponseDTO(Address address) {
        return new AddressResponseDTO(
                address.getId(),
                address.getType(),
                address.getStreet(),
                address.getNumber(),
                address.getComplement(),
                address.getNeighborhood(),
                address.getCity(),
                address.getState(),
                address.getCountry(),
                address.getZipCode(),
                address.isPrimaryAddress(),
                address.getCreatedAt(),
                address.getUpdatedAt());
    }

    public List<AddressResponseDTO> toResponseDTOList(List<Address> addresses) {
        return addresses.stream().map(this::toResponseDTO).toList();
    }
}
