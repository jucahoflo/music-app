#!/bin/bash

echo "=== AGREGAR CANCIÓN A MUSIC ==="
echo ""

# Pedir datos
read -p "Nombre de la canción (sin espacios, usar _ ): " NOMBRE
read -p "Artista: " ARTISTA
read -p "Duración (ej: 3:45): " DURACION
read -p "Género (salsa/bailables/balada/pop/rock/bachata/ranchera/merengues/bolero/madres/padre/religiosa/agropecuaria-popular): " GENERO
read -p "Ruta del archivo MP3: " RUTA_MP3
read -p "Ruta del archivo PDF: " RUTA_PDF

# Validar género
case $GENERO in
  salsa|bailables|balada|pop|rock|bachata|ranchera|merengues|bolero|madres|padre|religiosa|agropecuaria-popular)
    echo "✅ Género válido"
    ;;
  *)
    echo "❌ Género inválido"
    exit 1
    ;;
esac

# Copiar archivos
echo "📁 Copiando archivos..."
cp "$RUTA_MP3" "public/mp3/$NOMBRE.mp3"
cp "$RUTA_PDF" "public/pdf/$NOMBRE.pdf"
echo "✅ Archivos copiados"

# Actualizar API automáticamente
echo "📝 Actualizando API..."

# Buscar la línea del género y agregar la canción
sed -i "/$GENERO: \[/a \    { id: 'new', title: '$NOMBRE', artist: '$ARTISTA', duration: '$DURACION', mp3Url: '/mp3/$NOMBRE.mp3', pdfUrl: '/pdf/$NOMBRE.pdf' }," app/api/genres/[slug]/route.ts

echo "✅ Canción agregada a $GENERO"

# Subir a GitHub
echo "📤 Subiendo a GitHub..."
git add public/mp3/$NOMBRE.mp3 public/pdf/$NOMBRE.pdf app/api/genres/[slug]/route.ts
git commit -m "Agregar $NOMBRE a $GENERO"
git push origin railway-clean

echo ""
echo "🎉 ¡LISTO! La canción estará disponible en breve"
echo "🌐 https://music-app-production-f6cb.up.railway.app/genres/$GENERO"
