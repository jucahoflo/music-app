#!/bin/bash

echo "=== AGREGAR CANCIÓN A MUSIC ==="
echo ""

# Normalizar texto
normalizar() {
  echo "$1" | tr '[:lower:]' '[:upper:]' | sed 's/ /_/g'
}

# Pedir datos
read -p "Nombre de la canción: " NOMBRE_RAW
NOMBRE=$(echo "$NOMBRE_RAW" | sed 's/ /_/g')

read -p "Artista: " ARTISTA
read -p "Duración (ej: 3:45): " DURACION
read -p "Género (escribe exactamente como aparece en la URL): " GENERO
read -p "Ruta del archivo MP3: " RUTA_MP3
read -p "Ruta del archivo PDF: " RUTA_PDF

# Verificar si los archivos existen
if [ ! -f "$RUTA_MP3" ]; then
  echo "❌ ERROR: No se encuentra el archivo MP3 en: $RUTA_MP3"
  exit 1
fi

if [ ! -f "$RUTA_PDF" ]; then
  echo "❌ ERROR: No se encuentra el archivo PDF en: $RUTA_PDF"
  exit 1
fi

# Verificar si la canción ya existe
if grep -qi "title: '$NOMBRE'" app/api/genres/[slug]/route.ts; then
  echo ""
  echo "❌ ERROR: La canción '$NOMBRE_RAW' YA EXISTE"
  exit 1
fi

# Copiar archivos
echo ""
echo "📁 Copiando archivos..."
cp "$RUTA_MP3" "public/mp3/$NOMBRE.mp3"
cp "$RUTA_PDF" "public/pdf/$NOMBRE.pdf"
echo "✅ Archivos copiados"

# Obtener próximo ID
ULTIMO_ID=$(grep -o "id: '[0-9]*'" app/api/genres/[slug]/route.ts | tail -1 | grep -o "[0-9]*")
NUEVO_ID=$((ULTIMO_ID + 1))

# Actualizar API
echo ""
echo "📝 Actualizando API..."
sed -i "/$GENERO: \[/a \    { id: '$NUEVO_ID', title: '$NOMBRE', artist: '$ARTISTA', duration: '$DURACION', mp3Url: '/mp3/$NOMBRE.mp3', pdfUrl: '/pdf/$NOMBRE.pdf' }," app/api/genres/[slug]/route.ts

echo "✅ Canción agregada a $GENERO"

# Subir a GitHub
echo ""
echo "📤 Subiendo a GitHub..."
git add public/mp3/$NOMBRE.mp3 public/pdf/$NOMBRE.pdf app/api/genres/[slug]/route.ts
git commit -m "Agregar $NOMBRE a $GENERO"
git push origin railway-clean

echo ""
echo "🎉 ¡LISTO!"
