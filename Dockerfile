# Estágio 1: Compilação (Build)
# Usamos a imagem do .NET SDK que contém todas as ferramentas de compilação.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o arquivo de projeto e restaura as dependências primeiro para otimizar o cache.
COPY ["src/SistemaPonto.Api/SistemaPonto.Api.csproj", "SistemaPonto.Api/"]
RUN dotnet restore "SistemaPonto.Api/SistemaPonto.Api.csproj"

# Copia o resto do código-fonte e compila o projeto.
COPY src/ .
WORKDIR "/src/SistemaPonto.Api"
RUN dotnet build "SistemaPonto.Api.csproj" -c Release -o /app/build

# Estágio 2: Publicação (Publish)
# Gera a versão final e otimizada da aplicação.
FROM build AS publish
RUN dotnet publish "SistemaPonto.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Estágio 3: Imagem Final (Final)
# Usamos a imagem do ASP.NET Runtime, que é muito menor e mais segura, pois não contém o SDK.
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SistemaPonto.Api.dll"]