#!/bin/bash

echo "=== AGREGAR CANCIÓN FÁCIL ==="
echo ""

read -p "📝 Nombre del archivo MP3 (ej: cancion.mp3): " MP3
read -p "📄 Nombre del archivo PDF (ej: cancion.pdf): " PDF
read -p "🎤 Artista: " ARTISTA
read -p "⏱️  Duración (ej: 3:45): " DURACION

echo ""
echo "🎵 Género:"
echo "  1. salsa        2. bailables    3. merengues"
echo "  4. balada       5. pop          6. rock"
echo "  7. bachata      8. ranchera     9. bolero"
echo " 10. madres      11. padre       12. religiosa"
echo " 13. agropecuaria-popular"
read -p "Número: " GEN_NUM

case $GEN_NUM in
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
  *) echo "❌ Inválido"; exit 1 ;;
esac

# Verificar archivos
if [ ! -f "public/mp3/$MP3" ]; then
  echo "❌ No existe public/mp3/$MP3"
  exit 1
fi
if [ ! -f "public/pdf/$PDF" ]; then
  echo "❌ No existe public/pdf/$PDF"
  exit 1
fi

TITULO=$(basename "$MP3" .mp3)

# Obtener próximo ID
ULTIMO_ID=$(grep -o "id: '[0-9]*'" app/api/genres/[slug]/route.ts | tail -1 | grep -o "[0-9]*")
NUEVO_ID=$((ULTIMO_ID + 1))

# Agregar canción
sed -i "/$GENERO: \[/a \    { id: '$NUEVO_ID', title: '$TITULO', artist: '$ARTISTA', duration: '$DURACION', mp3Url: '/mp3/$MP3', pdfUrl: '/pdf/$PDF' }," app/api/genres/[slug]/route.ts

echo "✅ Canción '$TITULO' agregada a $GENERO"

read -p "¿Subir a GitHub? (s/n): " SUBIR
if [ "$SUBIR" = "s" ]; then
  git add .
  git commit -m "Agregar $TITULO a $GENERO"
  git push origin railway-clean
  echo "✅ Subido. Railway redeploy automático."
else
  echo "Recuerda hacer git push después."
fi
