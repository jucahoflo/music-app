#!/bin/bash

echo "=== AGREGAR CANCIÓN ==="
echo ""

read -p "🎵 Nombre del MP3 (ej: cancion.mp3): " MP3
read -p "📄 Nombre del PDF (ej: cancion.pdf): " PDF
read -p "🎤 Artista: " ARTISTA
read -p "⏱️  Duración: " DURACION

echo ""
echo "🎭 GÉNEROS:"
echo " 1) salsa      2) bailables   3) merengues"
echo " 4) balada     5) pop         6) rock"
echo " 7) bachata    8) ranchera    9) bolero"
echo "10) madres    11) padre      12) religiosa"
echo "13) agropecuaria-popular"
read -p "Número: " GEN

case $GEN in
  1) GENERO="salsa" ;;
  2) GENERO="bailables" ;;
  3) GENERO="merengues" ;;
  4) GENERO="balada" ;;
  5) GENERO="pop" ;;
  6) GENERO="rock" ;;
  7) GENERO="bachata" ;;
  8) GENERO="ranchera" ;;
  9) GENERO="bolero" ;;
  10) GENERO="madres" ;;
  11) GENERO="padre" ;;
  12) GENERO="religiosa" ;;
  13) GENERO="agropecuaria-popular" ;;
  *) echo "❌ Opción inválida"; exit 1 ;;
esac

# Verificar archivos
[ ! -f "public/mp3/$MP3" ] && echo "❌ Falta MP3" && exit 1
[ ! -f "public/pdf/$PDF" ] && echo "❌ Falta PDF" && exit 1

TITULO=$(basename "$MP3" .mp3)
ID=$(date +%s)

# Agregar al archivo
sed -i "/$GENERO: \[/a \    { id: '$ID', title: '$TITULO', artist: '$ARTISTA', duration: '$DURACION', mp3Url: '/mp3/$MP3', pdfUrl: '/pdf/$PDF' }," app/api/genres/[slug]/route.ts

echo "✅ Canción agregada a $GENERO"

read -p "📤 ¿Subir a GitHub? (s/n): " UP
if [[ "$UP" == "s" ]]; then
  git add .
  git commit -m "Agregar $TITULO a $GENERO"
  git push origin railway-clean
  echo "✅ Subido. Railway redeploy automático."
fi
