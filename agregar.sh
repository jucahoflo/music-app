#!/bin/bash

echo "========================================="
echo "     AGREGAR CANCIÓN A MUSIC APP"
echo "========================================="
echo ""

# Colores
VERDE='\033[0;32m'
ROJO='\033[0;31m'
NC='\033[0m'

# Normalizar nombre
normalizar() {
  echo "$1" | tr ' ' '_' | tr '[:lower:]' '[:upper:]'
}

# Pedir datos
read -p "📝 Nombre de la canción: " NOMBRE_RAW
read -p "🎤 Artista: " ARTISTA
read -p "⏱️  Duración (ej: 3:45): " DURACION
read -p "🎵 Género (salsa/bailables/merengues/balada/pop/rock/bachata/ranchera/bolero/madres/padre/religiosa/agropecuaria-popular): " GENERO
read -p "📁 Ruta del archivo MP3: " RUTA_MP3
read -p "📄 Ruta del archivo PDF: " RUTA_PDF

# Normalizar
NOMBRE=$(normalizar "$NOMBRE_RAW")
GENERO=$(echo "$GENERO" | tr '[:upper:]' '[:lower:]')

# Validar archivos
if [ ! -f "$RUTA_MP3" ]; then
  echo -e "${ROJO}❌ Error: No se encuentra el MP3${NC}"
  exit 1
fi

if [ ! -f "$RUTA_PDF" ]; then
  echo -e "${ROJO}❌ Error: No se encuentra el PDF${NC}"
  exit 1
fi

# Verificar duplicado en songsData
if grep -q "title: '$NOMBRE'" app/api/genres/[slug]/route.ts; then
  echo -e "${ROJO}❌ Error: La canción '$NOMBRE_RAW' ya existe${NC}"
  exit 1
fi

# Copiar archivos
cp "$RUTA_MP3" "public/mp3/$NOMBRE.mp3"
cp "$RUTA_PDF" "public/pdf/$NOMBRE.pdf"
echo -e "${VERDE}✅ Archivos copiados${NC}"

# Obtener próximo ID
ULTIMO_ID=$(grep -o "id: '[0-9]*'" app/api/genres/[slug]/route.ts | tail -1 | grep -o "[0-9]*")
NUEVO_ID=$((ULTIMO_ID + 1))

# Agregar canción a songsData del género correspondiente
sed -i "/$GENERO: \[/a \    { id: '$NUEVO_ID', title: '$NOMBRE', artist: '$ARTISTA', duration: '$DURACION', mp3Url: '/mp3/$NOMBRE.mp3', pdfUrl: '/pdf/$NOMBRE.pdf' }," app/api/genres/[slug]/route.ts

# Actualizar contador en app/api/genres/route.ts
CONTADOR_ACTUAL=$(grep -i "\"$GENERO\"" app/api/genres/route.ts | grep -o "songCount: [0-9]*" | head -1 | grep -o "[0-9]*")
if [ -z "$CONTADOR_ACTUAL" ]; then
  CONTADOR_ACTUAL=0
fi
NUEVO_CONTADOR=$((CONTADOR_ACTUAL + 1))
sed -i "s/\(\"$GENERO\".*songCount:\) [0-9]*/\1 $NUEVO_CONTADOR/i" app/api/genres/route.ts

echo -e "${VERDE}✅ Canción agregada a $GENERO${NC}"

# Subir a GitHub
git add public/mp3/$NOMBRE.mp3 public/pdf/$NOMBRE.pdf app/api/genres/[slug]/route.ts app/api/genres/route.ts
git commit -m "Agregar $NOMBRE a $GENERO"
git push origin railway-clean

echo ""
echo -e "${VERDE}🎉 ¡COMPLETADO!${NC}"
echo "🌐 https://music-app-production-f6cb.up.railway.app/genres/$GENERO"
echo ""
echo "⏳ Espera 2-3 minutos a que Railway redeploye"
