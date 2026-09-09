package com.portfolio.controller;

import com.portfolio.dto.address.AddressRequestDTO;
import com.portfolio.dto.address.AddressResponseDTO;
import com.portfolio.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints dos endereços/contatos vinculados ao perfil.
 *
 * <p>GET é público. POST, PUT e DELETE são administrativos e exigem
 * o header {@code X-Admin-Token}.</p>
 */
@RestController
@RequestMapping("/api/profile/addresses")
@Tag(name = "Addresses", description = "Gestão dos endereços e contatos vinculados ao perfil")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    @Operation(summary = "Listar endereços/contatos",
            description = "Rota pública. Lista todos os endereços/contatos vinculados ao perfil.")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    public ResponseEntity<List<AddressResponseDTO>> listAddresses() {
        return ResponseEntity.ok(addressService.listAddresses());
    }

    @PostMapping
    @Operation(summary = "Criar endereço/contato (Admin)",
            description = "Rota administrativa protegida por X-Admin-Token.",
            security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "201", description = "Endereço/contato criado com sucesso")
    @ApiResponse(responseCode = "401", description = "Token administrativo ausente ou inválido")
    public ResponseEntity<AddressResponseDTO> createAddress(@Valid @RequestBody AddressRequestDTO requestDTO) {
        AddressResponseDTO created = addressService.createAddress(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar endereço/contato (Admin)",
            security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "200", description = "Endereço/contato atualizado com sucesso")
    @ApiResponse(responseCode = "404", description = "Endereço/contato não encontrado")
    public ResponseEntity<AddressResponseDTO> updateAddress(
            @Parameter(description = "ID do endereço/contato") @PathVariable Long id,
            @Valid @RequestBody AddressRequestDTO requestDTO) {
        return ResponseEntity.ok(addressService.updateAddress(id, requestDTO));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover endereço/contato (Admin)",
            security = @SecurityRequirement(name = "X-Admin-Token"))
    @ApiResponse(responseCode = "204", description = "Endereço/contato removido com sucesso")
    @ApiResponse(responseCode = "404", description = "Endereço/contato não encontrado")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}
