# Makefile pour la compilation du dossier CDA LaTeX
# Utilise XeLaTeX pour la compilation avec support des polices

# Variables
MAIN = main
TEX_ENGINE = xelatex
LATEXMK = latexmk
SHELL_ESCAPE = -shell-escape
INTERACTION = -interaction=nonstopmode
FILE_LINE_ERROR = -file-line-error

# Cible principale : génération du PDF
pdf: $(MAIN).tex
	$(LATEXMK) -$(TEX_ENGINE) $(SHELL_ESCAPE) $(INTERACTION) $(FILE_LINE_ERROR) $(MAIN).tex

# Cible pour compilation rapide (sans mise à jour de la bibliographie)
quick: $(MAIN).tex
	$(TEX_ENGINE) $(SHELL_ESCAPE) $(INTERACTION) $(FILE_LINE_ERROR) $(MAIN).tex

# Cible pour compilation avec mise à jour de la bibliographie
full: $(MAIN).tex
	$(LATEXMK) -$(TEX_ENGINE) $(SHELL_ESCAPE) $(INTERACTION) $(FILE_LINE_ERROR) -bibtex $(MAIN).tex

# Cible pour compilation continue (surveillance des changements)
watch: $(MAIN).tex
	$(LATEXMK) -$(TEX_ENGINE) $(SHELL_ESCAPE) $(INTERACTION) $(FILE_LINE_ERROR) -pvc $(MAIN).tex

# Nettoyage des fichiers temporaires
clean:
	rm -rf _minted* *.aux *.bbl *.bcf *.blg *.fdb_latexmk *.fls *.log *.out *.run.xml *.toc *.lof *.lot *.idx *.ind *.ilg *.lol *.nav *.snm *.vrb *.synctex.gz

# Nettoyage complet (inclut le PDF)
distclean: clean
	rm -f $(MAIN).pdf

# Installation des dépendances (si nécessaire)
install-deps:
	@echo "Vérification des dépendances LaTeX..."
	@which $(TEX_ENGINE) > /dev/null || (echo "XeLaTeX non trouvé. Veuillez installer TeXLive ou MiKTeX." && exit 1)
	@which $(LATEXMK) > /dev/null || (echo "latexmk non trouvé. Veuillez installer TeXLive." && exit 1)
	@echo "Dépendances OK."

# Vérification de la structure du projet
check-structure:
	@echo "Vérification de la structure du projet..."
	@test -f $(MAIN).tex || (echo "Fichier $(MAIN).tex manquant." && exit 1)
	@test -d chapters/ || (echo "Dossier chapters/ manquant." && exit 1)
	@test -d assets/ || (echo "Dossier assets/ manquant." && exit 1)
	@echo "Structure OK."

# Génération d'un PDF de test (sans le logo)
test-pdf: check-structure
	@echo "Génération d'un PDF de test..."
	$(LATEXMK) -$(TEX_ENGINE) $(SHELL_ESCAPE) $(INTERACTION) $(FILE_LINE_ERROR) $(MAIN).tex

# Aide
help:
	@echo "Commandes disponibles :"
	@echo "  make pdf          - Compilation complète du PDF"
	@echo "  make quick        - Compilation rapide (sans bibliographie)"
	@echo "  make full         - Compilation avec bibliographie"
	@echo "  make watch        - Compilation continue (surveillance)"
	@echo "  make clean        - Nettoyage des fichiers temporaires"
	@echo "  make distclean    - Nettoyage complet (inclut le PDF)"
	@echo "  make install-deps - Vérification des dépendances"
	@echo "  make check-structure - Vérification de la structure"
	@echo "  make test-pdf     - Génération d'un PDF de test"
	@echo "  make help         - Affichage de cette aide"

# Cible par défaut
.DEFAULT_GOAL := pdf

# Phony targets
.PHONY: pdf quick full watch clean distclean install-deps check-structure test-pdf help
