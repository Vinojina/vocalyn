import fs from 'fs/promises';
import path from 'path';

export const getLyrics = async (req, res) => {
  try {
    const { songFile } = req.params;
    const filePath = path.join(process.cwd(), 'json', `${songFile}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const lyrics = JSON.parse(data);
    res.status(200).json(lyrics);
  } catch (error) {
    res.status(404).json({ message: 'Lyrics file not found' });
  }
};
