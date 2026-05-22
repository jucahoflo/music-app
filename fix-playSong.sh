#!/bin/bash

cd ~/Documents/MUSIC

# Crear backup
cp app/genres/[genreName]/page.tsx app/genres/[genreName]/page.tsx.bak2

# Modificar la función playSong
sed -i '/const playSong = (song: Song) => {/,/^  }/c\
  const playSong = (song: Song) => {\
    if (currentSong?.id === song.id && isPlaying) {\
      stopCurrentSong()\
      return\
    }\
    \
    if (globalAudio) {\
      globalAudio.pause()\
      globalAudio.currentTime = 0\
      globalAudio = null\
    }\
    \
    const audio = new Audio()\
    audio.src = song.mp3Url\
    audio.volume = volume\
    audio.setAttribute('\''data-song-id'\'', song.id)\
    audio.setAttribute('\''data-song-title'\'', song.title)\
    audio.setAttribute('\''data-song-artist'\'', song.artist)\
    audio.setAttribute('\''data-song-duration'\'', song.duration)\
    audio.setAttribute('\''data-song-pdf'\'', song.pdfUrl)\
    \
    setCurrentSong(song)\
    setCurrentTime(0)\
    setDuration(0)\
    \
    const onCanPlay = () => {\
      audio.play()\
        .then(() => setIsPlaying(true))\
        .catch(err => console.error('\''Error:'\'', err))\
    }\
    \
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)\
    const onLoadedMetadata = () => setDuration(audio.duration)\
    const onEnded = () => {\
      setIsPlaying(false)\
      setCurrentSong(null)\
      setCurrentTime(0)\
      setShowPdf(null)\
      globalAudio = null\
    }\
    \
    audio.addEventListener('\''canplay'\'', onCanPlay)\
    audio.addEventListener('\''timeupdate'\'', onTimeUpdate)\
    audio.addEventListener('\''loadedmetadata'\'', onLoadedMetadata)\
    audio.addEventListener('\''ended'\'', onEnded)\
    \
    audio.load()\
    \
    globalAudio = audio\
    \
    // Abrir PDF en modal (con botón de regreso)\
    if (song.pdfUrl && song.pdfUrl !== '\''#'\'') {\
      setShowPdf({ url: song.pdfUrl, title: song.title })\
    }\
  }' app/genres/[genreName]/page.tsx

echo "✅ Función playSong actualizada"
