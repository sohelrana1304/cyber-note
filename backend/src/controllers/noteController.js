import noteModel from "../model/noteModel.js";

export const getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find({ user: req.user });

    if (notes.length === 0) {
      return res
        .status(404)
        .send({ status: false, message: "You don't have any note" });
    }
    return res.status(200).send(notes);
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).send({ status: false, message: error.message });
  }
};
export const createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res
        .status(400)
        .send({ status: false, message: "Please fill all the fields" });
    } else {
      const note = new noteModel({
        user: req.user,
        title,
        content,
        category,
      });

      const createNote = await note.save();

      return res.status(201).send({ status: true, message: createNote });
    }
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);

    if (note) {
      return res.status(200).send({ status: true, message: note });
    } else {
      return res.status(404).send({ status: false, message: "Note not found" });
    }
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);

    if (!note) {
      return res.status(404).send({ status: false, message: "Note not found" });
    }
    if (note.user.toString() !== req.user) {
      return res
        .status(401)
        .send({ message: "You are unauthorized to perfrom this task" });
    }

    const { title, content, category } = req.body;

    if (title === "" || content === "" || category === "") {
      return res.status(400).send({ message: "Field can't be empty" });
    }

    const updateNote = await noteModel.findByIdAndUpdate(
      note,
      { $set: req.body },
      { new: true }
    );

    if (updateNote) {
      return res.status(201).send({
        status: true,
        message: "Note updated successfully",
        updateNote,
      });
    }
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await noteModel.findById(req.params.id);

    if (!note) {
      return res.status(404).send({ status: false, message: "Note not found" });
    }
    if (note.user.toString() !== req.user) {
      return res
        .status(401)
        .send({ message: "You are unauthorized to perfrom this task" });
    }

    const deleteNote = await noteModel.findByIdAndRemove(note);

    if (deleteNote) {
      return res.status(201).send({
        status: true,
        message: "Note removed successfully",
      });
    }
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).send({ status: false, message: error.message });
  }
};
