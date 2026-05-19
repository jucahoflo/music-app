#!/bin/bash

echo "=== AGREGAR CANCIÓN ==="
echo ""

read -p "Nombre: " NOMBRE
read -p "Artista: " ARTISTA
read -p "Género: " GENERO
read -p "MP3: " MP3
read -p "PDF: " PDF

# Verificar archivos
[ ! -f "$MP3" ] && echo "❌ MP3 no existe" && exit 1
[ ! -f "$PDF" ] && echo "❌ PDF no existe" && exit 1

# Normalizar nombre
NOMBRE=$(echo "$NOMBRE" | tr ' ' '_' | tr '[:lower:]' '[:upper:]')
GENERO=$(echo "$GENERO" | tr '[:upper:]' '[:lower:]')

# Verificar duplicado
grep -qi "$NOMBRE" app/api/genres/[slug]/route.ts && echo "❌ Ya existe" && exit 1

# Copiar
cp "$MP3" "public/mp3/$NOMBRE.mp3"
cp "$PDF" "public/pdf/$NOMBRE.pdf"

# Obtener ID
ID=$(grep -o "id: '[0-9]*'" app/api/genres/[slug]/route.ts | tail -1 | grep -o "[0-9]*")
ID=$((ID + 1))

# Agregar a API
sed -i "/$GENERO: \[/a \    { id: '$ID', title: '$NOMBRE', artist: '$ARTISTA', duration: '3:30', mp3Url: '/mp3/$NOMBRE.mp3', pdfUrl: '/pdf/$NOMBRE.pdf' }," app/api/genres/[slug]/route.ts

# Subir
git add . && git commit -m "Agregar $NOMBRE" && git push

echo "✅ LISTO!"
