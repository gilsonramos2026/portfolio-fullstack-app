package com.portfolio.service.impl;

import com.portfolio.domain.Address;
import com.portfolio.domain.Profile;
import com.portfolio.dto.address.AddressRequestDTO;
import com.portfolio.dto.address.AddressResponseDTO;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.AddressMapper;
import com.portfolio.repository.AddressRepository;
import com.portfolio.repository.ProfileRepository;
import com.portfolio.service.AddressService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementação das regras de negócio dos endereços/contatos,
 * sempre vinculados ao perfil único da aplicação.
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final ProfileRepository profileRepository;
    private final AddressMapper addressMapper;

    public AddressServiceImpl(AddressRepository addressRepository,
                               ProfileRepository profileRepository,
                               AddressMapper addressMapper) {
        this.addressRepository = addressRepository;
        this.profileRepository = profileRepository;
        this.addressMapper = addressMapper;
    }

    @Override
    public List<AddressResponseDTO> listAddresses() {
        Profile profile = getSingletonProfile();
        List<Address> addresses = addressRepository
                .findByProfileIdOrderByPrimaryAddressDescIdAsc(profile.getId());
        return addressMapper.toResponseDTOList(addresses);
    }

    @Override
    @Transactional
    public AddressResponseDTO createAddress(AddressRequestDTO requestDTO) {
        Profile profile = getSingletonProfile();
        Address address = addressMapper.toEntity(requestDTO, profile);
        Address saved = addressRepository.save(address);
        log.info("Endereço/contato criado pelo Admin (id={})", saved.getId());
        return addressMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public AddressResponseDTO updateAddress(Long addressId, AddressRequestDTO requestDTO) {
        Address address = findAddressOrThrow(addressId);
        addressMapper.updateEntityFromDto(requestDTO, address);
        Address saved = addressRepository.save(address);
        log.info("Endereço/contato atualizado pelo Admin (id={})", saved.getId());
        return addressMapper.toResponseDTO(saved);
    }

    @Override
    @Transactional
    public void deleteAddress(Long addressId) {
        Address address = findAddressOrThrow(addressId);
        addressRepository.delete(address);
        log.info("Endereço/contato removido pelo Admin (id={})", addressId);
    }

    private Address findAddressOrThrow(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.forEntity("Endereço/contato", id));
    }

    private Profile getSingletonProfile() {
        return profileRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Nenhum perfil cadastrado. Cadastre o perfil antes de adicionar endereços."));
    }
}
