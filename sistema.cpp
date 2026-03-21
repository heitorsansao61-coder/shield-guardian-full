#include <stdio.h>
#include <string.h>
#include <dirent.h>

/* SISTEMA INTEGRADO: CPP (Motor) + R (Analista)
   Objetivo: Coletar metadados para busca de informações profunda.
*/

int main() {
    struct dirent *arquivo;
    DIR *diretorio = opendir("."); 
    
    // Criando o arquivo que a Língua R vai ler
    FILE *exportar_r = fopen("dados_para_r.csv", "w");

    if (diretorio == NULL || exportar_r == NULL) {
        printf("Erro ao iniciar integração.\n");
        return 1;
    }

    // Cabeçalho para a Língua R entender os campos
    fprintf(exportar_r, "nome_arquivo,tamanho_suspeito\n");

    while ((arquivo = readdir(diretorio))) {
        char *n = arquivo->d_name;

        // O CPP identifica a existência do arquivo
        if (strcmp(n, ".") != 0 && strcmp(n, "..") != 0) {
            int nivel_suspeito = 0;
            
            // Marcação de dados para a Língua R analisar depois
            if (strstr(n, ".exe") || strstr(n, ".bat")) {
                nivel_suspeito = 1;
            }

            // Manda a informação para a Língua R
            fprintf(exportar_r, "%s,%d\n", n, nivel_suspeito);
            printf("CPP coletando informacao de: %s\n", n);
        }
    }

    fclose(exportar_r);
    closedir(diretorio);
    
    printf("\n[!] Sucesso: Dados enviados para a Lingua R em 'dados_para_r.csv'\n");
    return 0;
}
