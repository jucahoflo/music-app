#!/bin/bash

echo "========================================="
echo "     AGREGAR CANCIÓN A MUSIC APP"
echo "========================================="
echo ""

# Mostrar archivos disponibles
echo "📁 Archivos MP3 disponibles en public/mp3/:"
ls -la public/mp3/*.mp3 2>/dev/null | awk '{print "   - " $9}' | sed 's|public/mp3/||'
echo ""
echo "📁 Archivos PDF disponibles en public/pdf/:"
ls -la public/pdf/*.pdf 2>/dev/null | awk '{print "   - " $9}' | sed 's|public/pdf/||'
echo ""

# Pedir datos
read -p "📝 Nombre del archivo MP3 (ej: cancion.mp3): " MP3_FILE
read -p "📄 Nombre del archivo PDF (ej: cancion.pdf): " PDF_FILE
read -p "🎤 Artista: " ARTISTA
read -p "⏱️  Duración (ej: 3:45): " DURACION
echo ""
echo "🎵 Géneros disponibles:"
echo "   1. salsa       2. bailables    3. merengues"
echo "   4. balada      5. pop         6. rock"
echo "   7. bachata     8. ranchera    9. bolero"
echo "   10. madres     11. padre      12. religiosa"
echo "   13. agropecuaria-popular"
echo ""
read -p "Selecciona el número de género (1-13): " GEN_NUM

# Asignar género
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
  *) echo "❌ Género inválido"; exit 1 ;;
esac

# Normalizar nombre
NOMBRE=$(basename "$MP3_FILE" .mp3 | tr ' ' '_' | tr '[:lower:]' '[:upper:]')

# Verificar archivos
if [ ! -f "public/mp3/$MP3_FILE" ]; then
  echo "❌ Error: No se encuentra public/mp3/$MP3_FILE"
  exit 1
fi

if [ ! -f "public/pdf/$PDF_FILE" ]; then
  echo "❌ Error: No se encuentra public/pdf/$PDF_FILE"
  exit 1
fi

echo ""
echo "📋 Resumen:"
echo "   Canción: $NOMBRE"
echo "   Artista: $ARTISTA"
echo "   Duración: $DURACION"
echo "   Género: $GENERO"
echo ""

read -p "¿Confirmar? (s/n): " CONFIRMAR
if [ "$CONFIRMAR" != "s" ]; then
  echo "❌ Cancelado"
  exit 1
fi

# Obtener próximo ID
ULTIMO_ID=$(grep -o "id: '[0-9]*'" app/api/genres/[slug]/route.ts | tail -1 | grep -o "[0-9]*")
NUEVO_ID=$((ULTIMO_ID + 1))

# Agregar canción al género
sed -i "/$GENERO: \[/a \    { id: '$NUEVO_ID', title: '$NOMBRE', artist: '$ARTISTA', duration: '$DURACION', mp3Url: '/mp3/$MP3_FILE', pdfUrl: '/pdf/$PDF_FILE' }," app/api/genres/[slug]/route.ts

# NOTA: Ya NO necesitas actualizar el contador manualmente!
# La API de géneros ahora lo calcula automáticamente

# Subir a GitHub
git add .
git commit -m "Agregar $NOMBRE a $GENERO (contador automático)"
git push origin railway-clean

echo ""
echo "✅ ¡COMPLETADO!"
echo "🌐 https://music-app-production-9241.up.railway.app/genres/$GENERO"
echo "⏳ Redeploy automático en 2-3 minutos"
echo "📊 El contador se actualizará automáticamente"
