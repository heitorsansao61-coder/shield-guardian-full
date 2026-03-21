# R - MODULO DE ANALISE DE SEGURANCA
# Objetivo: Analisar dados recebidos do modulo C++ e identificar padroes suspeitos

# 1. Carregar dados gerados pelo modulo C++
dados_cpp <- read.csv("dados_para_r.csv", stringsAsFactors = FALSE)

# 2. Funcao principal de analise
analise_segurança <- function(tabela) {
  
    cat("=== INICIANDO ANALISE DE SEGURANCA ===\n")
      
        # Calcular tamanho do nome dos arquivos
          tabela$tamanho_nome <- nchar(tabela$nome_arquivo)
            
              # Identificar arquivos potencialmente suspeitos
                suspeitos <- subset(tabela, tamanho_suspeito == 1 | tamanho_nome > 20)
                  
                    # Verificar resultados
                      if (nrow(suspeitos) > 0) {
                          
                              cat("ALERTA: Possiveis padroes maliciosos detectados.\n")
                                  print(suspeitos)
                                      
                                          # Estatistica de ocorrencia de arquivos suspeitos
                                              frequencia <- table(tabela$tamanho_suspeito)
                                                  
                                                      cat("\nRelatorio estatistico de risco:\n")
                                                          print(frequencia)
                                                              
                                                                } else {
                                                                    
                                                                        cat("Resultado: Nenhuma atividade suspeita detectada.\n")
                                                                            
                                                                              }
                                                                                
                                                                                  return(tabela)
                                                                                  }

                                                                                  # 3. Executar analise
                                                                                  resultado <- analise_segurança(dados_cpp)

                                                                                  # 4. Salvar relatorio final
                                                                                  write.csv(resultado, "relatorio_final_virus.csv", row.names = FALSE)