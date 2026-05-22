#!/bin/bash

echo "=== SINCRONIZAR CANCIONES A MUSIC ==="
echo ""

# Crear carpetas si no existen
mkdir -p ~/MUSIC_SYNC/mp3
mkdir -p ~/MUSIC_SYNC/pdf

echo "📁 Para sincronizar, coloca tus archivos en:"
echo "   MP3: ~/MUSIC_SYNC/mp3/"
echo "   PDF: ~/MUSIC_SYNC/pdf/"
echo ""

# Mostrar archivos disponibles
echo "📂 Archivos MP3 encontrados:"
ls ~/MUSIC_SYNC/mp3/*.mp3 2>/dev/null | while read f; do echo "   - $(basename "$f")"; done
echo ""
echo "📂 Archivos PDF encontrados:"
ls ~/MUSIC_SYNC/pdf/*.pdf 2>/dev/null | while read f; do echo "   - $(basename "$f")"; done
echo ""

read -p "Nombre del archivo MP3: " MP3_FILE
read -p "Nombre del archivo PDF: " PDF_FILE
read -p "Artista: " ARTISTA
read -p "Duración (ej: 3:45): " DURACION
read -p "Género: " GENERO

# Normalizar nombre
NOMBRE=$(basename "$MP3_FILE" .mp3 | tr ' ' '_' | tr '[:lower:]' '[:upper:]')
GENERO=$(echo "$GENERO" | tr '[:upper:]' '[:lower:]')

# Verificar archivos
if [ ! -f "$HOME/MUSIC_SYNC/mp3/$MP3_FILE" ]; then
  echo "❌ MP3 no encontrado"
  exit 1
fi

if [ ! -f "$HOME/MUSIC_SYNC/pdf/$PDF_FILE" ]; then
  echo "❌ PDF no encontrado"
  exit 1
fi

# Copiar archivos
cp "$HOME/MUSIC_SYNC/mp3/$MP3_FILE" "public/mp3/$NOMBRE.mp3"
cp "$HOME/MUSIC_SYNC/pdf/$PDF_FILE" "public/pdf/$NOMBRE.pdf"
echo "✅ Archivos copiados"

# Obtener ID
ULTIMO_ID=$(grep -o "id: '[0-9]*'" app/api/genres/[slug]/route.ts | tail -1 | grep -o "[0-9]*")
NUEVO_ID=$((ULTIMO_ID + 1))

# Agregar a API
sed -i "/$GENERO: \[/a \    { id: '$NUEVO_ID', title: '$NOMBRE', artist: '$ARTISTA', duration: '$DURACION', mp3Url: '/mp3/$NOMBRE.mp3', pdfUrl: '/pdf/$NOMBRE.pdf' }," app/api/genres/[slug]/route.ts

# Actualizar contador
CONTADOR=$(grep -i "\"$GENERO\"" app/api/genres/route.ts | grep -o "songCount: [0-9]*" | head -1 | grep -o "[0-9]*")
NUEVO_CONTADOR=$((CONTADOR + 1))
sed -i "s/\(\"$GENERO\".*songCount:\) [0-9]*/\1 $NUEVO_CONTADOR/i" app/api/genres/route.ts

# Subir a GitHub
git add .
git commit -m "Sync: Agregar $NOMBRE a $GENERO"
git push origin railway-clean

echo ""
echo "✅ ¡COMPLETADO!"
echo "🌐 https://music-app-production-9241.up.railway.app/genres/$GENERO"
echo "⏳ Redeploy automático en 2-3 minutos"
