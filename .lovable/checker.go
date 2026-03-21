package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"
	_ "github.com/mattn/go-sqlite3"
)

// GO SECURITY COMBINER - HEITOR #1#
func main() {

	fmt.Println("Inicializando motor de análise...")
	time.Sleep(1 * time.Second)

	db, err := sql.Open("sqlite3", "./antivirus_heitor.db")
	if err != nil {
		log.Fatal("Erro ao abrir banco:", err)
	}
	defer db.Close()

	rows, err := db.Query("SELECT source_language, hex_signature, analysis_status FROM security_records")
	if err != nil {
		log.Fatal("Erro na consulta:", err)
	}
	defer rows.Close()

	fmt.Println("--- INICIANDO COMBINAÇÃO DE DADOS ---")

	total := 0
	virusDetectados := 0

	for rows.Next() {
		var lang string
		var hex string
		var status string

		err := rows.Scan(&lang, &hex, &status)
		if err != nil {
			fmt.Println("Erro ao ler linha:", err)
			continue
		}

		total++

		if hex == "0xEFBEADDE" || hex == "0xDEADBEEF" {
			fmt.Println("[!] COMBINAÇÃO DETECTADA!")
			fmt.Printf("Origem: %s\n", lang)
			fmt.Printf("Assinatura suspeita: %s\n", hex)
			fmt.Printf("Status da análise: %s\n", status)
			fmt.Println("Ação recomendada: quarentena imediata\n")
			virusDetectados++
		} else {
			fmt.Printf("[+] Informação limpa detectada -> %s (%s)\n", hex, lang)
		}
	}

	fmt.Println("\n--- RELATÓRIO FINAL ---")
	fmt.Printf("Total analisado: %d\n", total)
	fmt.Printf("Ameaças detectadas: %d\n", virusDetectados)

	if virusDetectados == 0 {
		fmt.Println("Sistema seguro.")
	} else {
		fmt.Println("Atenção: atividades suspeitas encontradas.")
	}
}
