import Level from '../models/Level.js';

export const addLevel = async (req, res) => {
  try {
    const level = new Level(req.body);
    await level.save();
    res.status(201).json({ message: 'Level added', level });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add level' });
  }
};

export const deleteLevel = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);
    if (!level) return res.status(404).json({ message: 'Level not found' });
    await level.deleteOne();
    res.json({ message: 'Level deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete level' });
  }
};
export const getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find();
    res.json(levels);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch levels' });
  }
};
