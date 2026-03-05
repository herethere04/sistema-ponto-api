using SistemaPonto.Application.DTOs;
using SistemaPonto.Application.Interfaces;
using SistemaPonto.Domain.Entities;

namespace SistemaPonto.Application.Services;

public class RegistroPontoService : IRegistroPontoService
{
    private readonly IRegistroPontoRepository _registroPontoRepository;

    public RegistroPontoService(IRegistroPontoRepository registroPontoRepository)
    {
        _registroPontoRepository = registroPontoRepository;
    }

    public async Task<RegistroPontoDto> RegistrarPontoAsync(int usuarioId)
    {
        // 1. Busca o último registro do funcionário no dia de hoje.
        var ultimoRegistro = await _registroPontoRepository.ObterUltimoRegistroDoDiaAsync(usuarioId);

        TipoRegistroEnum novoTipoRegistro;

        // 2. Aplica as regras de negócio
        if (ultimoRegistro == null || ultimoRegistro.TipoRegistro == TipoRegistroEnum.SAIDA)
        {
            // Se não há registros hoje, ou se o último foi uma SAÍDA, o novo registro é uma ENTRADA.
            novoTipoRegistro = TipoRegistroEnum.ENTRADA;
        }
        else
        {
            // Se o último registro foi uma ENTRADA, o novo registro é uma SAÍDA.
            novoTipoRegistro = TipoRegistroEnum.SAIDA;
        }

        // 3. Cria a nova entidade de registro de ponto
        var novoRegistro = new RegistroPonto
        {
            UsuarioId = usuarioId,
            Timestamp = DateTime.UtcNow,
            TipoRegistro = novoTipoRegistro
        };

        // 4. Salva o novo registro no banco de dados
        var registroSalvo = await _registroPontoRepository.AdicionarAsync(novoRegistro);

        // 5. Mapeia para o DTO de resposta
        return new RegistroPontoDto
        {
            Id = registroSalvo.Id,
            Timestamp = registroSalvo.Timestamp,
            TipoRegistro = registroSalvo.TipoRegistro.ToString(),
            UsuarioId = registroSalvo.UsuarioId
        };
    }
    public async Task<IEnumerable<RegistroPontoDto>> ObterHistoricoUsuarioAsync(int usuarioId)
    {
        var registros = await _registroPontoRepository.ObterHistoricoUsuarioAsync(usuarioId);
        
        return registros.Select(r => new RegistroPontoDto
        {
            Id = r.Id,
            Timestamp = r.Timestamp,
            TipoRegistro = r.TipoRegistro.ToString(),
            UsuarioId = r.UsuarioId
        });
    }
}