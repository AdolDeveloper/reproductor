$(document).ready(function () {
    // Obtener la lista de canciones disponibles desde el servidor
    $.ajax({
      url: '/songs',
      method: 'GET',
      success: function (songs) {
        // Mostrar las canciones en la lista
        const playlist = $('#playlist');
        songs.forEach(function (song) {
          const listItem = $('<li>').text(song).appendTo(playlist);
        });
  
        // Manejar clics en las canciones para reproducir
        playlist.on('click', 'li', function () {
          const songName = $(this).text();
          // Lógica para reproducir la canción seleccionada
          alert('Reproduciendo: ' + songName);
        });
      },
      error: function () {
        console.error('Error al obtener la lista de canciones.');
      }
    });
  });
  