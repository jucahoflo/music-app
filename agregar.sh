#!/bin/bash

echo "=== AGREGAR CANCIÓN A MUSIC ==="
echo ""

read -p "Nombre de la canción: " NOMBRE_RAW
read -p "Artista: " ARTISTA
read -p "Duración (ej: 3:45): " DURACION
read -p "Género (salsa/bailables/merengues/balada/pop/rock/bachata/ranchera/bolero/madres/padre/religiosa/agropecuaria-popular): " GENERO
read -p "Ruta del archivo MP3: " RUTA_MP3
read -p "Ruta del archivo PDF: " RUTA_PDF

# Normalizar nombre
NOMBRE=$(echo "$NOMBRE_RAW" | tr ' ' '_' | tr '[:lower:]' '[:upper:]')
GENERO=$(echo "$GENERO" | tr '[:upper:]' '[:lower:]')

# Validar archivos
if [ ! -f "$RUTA_MP3" ]; then
  echo "❌ Error: No se encuentra el MP3"
  exit 1
fi

if [ ! -f "$RUTA_PDF" ]; then
  echo "❌ Error: No se encuentra el PDF"
  exit 1
fi

# Verificar duplicado
if grep -qi "title: '$NOMBRE'" app/api/genres/[slug]/route.ts; then
  echo "❌ Error: La canción '$NOMBRE_RAW' ya existe"
  exit 1
fi

# Copiar archivos
cp "$RUTA_MP3" "public/mp3/$NOMBRE.mp3"
cp "$RUTA_PDF" "public/pdf/$NOMBRE.pdf"
echo "✅ Archivos copiados"

# Obtener próximo ID
ULTIMO_ID=$(grep -o "id: '[0-9]*'" app/api/genres/[slug]/route.ts | tail -1 | grep -o "[0-9]*")
NUEVO_ID=$((ULTIMO_ID + 1))

# Agregar canción al género
sed -i "/$GENERO: \[/a \    { id: '$NUEVO_ID', title: '$NOMBRE', artist: '$ARTISTA', duration: '$DURACION', mp3Url: '/mp3/$NOMBRE.mp3', pdfUrl: '/pdf/$NOMBRE.pdf' }," app/api/genres/[slug]/route.ts
echo "✅ Canción agregada a la API"

# Actualizar el contador de canciones en app/api/genres/route.ts
sed -i "s|$GENERO: [0-9]*,|$GENERO: $(($(grep -o "$GENERO: [0-9]*" app/api/genres/route.ts | grep -o "[0-9]*") + 1)),|" app/api/genres/route.ts
echo "✅ Contador actualizado"

# Subir a GitHub
git add public/mp3/$NOMBRE.mp3 public/pdf/$NOMBRE.pdf app/api/genres/[slug]/route.ts app/api/genres/route.ts
git commit -m "Agregar $NOMBRE a $GENERO"
git push origin railway-clean

echo ""
echo "🎉 ¡COMPLETADO!"
echo "🌐 https://music-app-production-f6cb.up.railway.app/genres/$GENERO"
