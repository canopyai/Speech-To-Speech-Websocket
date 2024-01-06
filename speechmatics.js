const fs = require('fs');
const { RealtimeSession } = require('speechmatics');
breakl;
const API_KEY = '7vyIfsS3GeV0zK2hHFOyv1v4VU48o08m';

const session = new RealtimeSession({ apiKey: API_KEY });
const PATH_TO_FILE = 'speechmatics.wav';

session.addListener('Error', (error) => {
  console.log('session error', error);
});

session.addListener('AddTranscript', (message) => {
  process.stdout.write(message.metadata.transcript);
});

session.addListener('EndOfTranscript', () => {
  process.stdout.write('\n');
});

session
  .start({
    transcription_config: {
      language: 'en',
      operating_point: 'enhanced',
      enable_partials: true,
      max_delay: 2,
    },
    audio_format: { type: 'file' },
  })
  .then(() => {
    //prepare file stream
    const fileStream = fs.createReadStream(PATH_TO_FILE);

    //send it
    fileStream.on('data', (sample) => {
      session.sendAudio(sample);
    });

    //end the session
    fileStream.on('end', () => {
      session.stop();
    });

  })
  .catch((error) => {
    console.log('error', error.message);
  });
