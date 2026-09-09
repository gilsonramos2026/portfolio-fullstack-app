package com.portfolio.service;


import com.portfolio.dto.address.AddressRequestDTO;
import com.portfolio.dto.address.AddressResponseDTO;

import java.util.List;

/**
 * Regras de negócio para os endereços/contatos vinculados ao perfil.
 */
public interface AddressService {

    List<AddressResponseDTO> listAddresses();

    AddressResponseDTO createAddress(AddressRequestDTO requestDTO);

    AddressResponseDTO updateAddress(Long addressId, AddressRequestDTO requestDTO);

    void deleteAddress(Long addressId);
}
