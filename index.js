const express = require('express');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const app = express();

app.use(fileUpload());

const GITHUB_USERNAME = 'AdolDeveloper';
const GITHUB_REPO = 'reproductor';
const GITHUB_TOKEN = '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';

// Ruta para servir archivos estáticos (por ejemplo, archivos de audio)
app.use(express.static('music'));

// Ruta para la página principal
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ruta para subir archivos
app.post('/upload', async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No se ha seleccionado ningún archivo.');
    }

    const audioFile = req.files.audioFile;
    const uploadPath = __dirname + '/music/' + audioFile.name;

    audioFile.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Subir el archivo al repositorio de GitHub
      await uploadToGitHub(uploadPath, audioFile.name);

      res.send('Archivo subido con éxito.');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor.');
  }
});

async function uploadToGitHub(filePath, fileName) {
  const fileContent = require('fs').readFileSync(filePath, 'base64');
  const apiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${fileName}`;

  const response = await axios.put(apiUrl, {
    message: 'Subir archivo',
    content: fileContent,
  }, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  });

  return response.data;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
