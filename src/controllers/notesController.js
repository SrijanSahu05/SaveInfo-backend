import Note from "../models/Note.js";

//This function will get all notes from the database
export async function getAllNotes(req, res){
    try{
        const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 }); // Sort by creation date descending
        res.status(200).json(notes);
    }
    catch (error) {
        console.error("Error in getAllNotes controller:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

//Create note function
export async function createNote(req, res){
    try{
        const {title, content} = req.body;

        if(!title || !content){
            res.status(400);
            throw new Error('All fields are required');
        }
        else {
            const note = new Note({
                user: req.user._id,
                title,
                content,
            });

            const savedNote = await note.save();
            res.status(201).json(savedNote);
        }
    }
    catch (error) {
        console.log("Error in createNote controller:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

//Read note by id function
export async function getNoteById(req, res){
    try{
        const note = await Note.findById(req.params.id);

        if(note){
            if(note.user.toString() !== req.user._id.toString()){
                res.status(401);
                throw new Error("You are not authorized to view this note.");
            }
            res.json(note);
        }
        else{
            res.status(404);
            throw new Error("Note not found");
        }
    }
    catch (error) {
        console.error("Error in getNoteById controller:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

//Update note function
export async function updateNote (req, res) {
    try{
        const {title, content} = req.body;
        const note = await Note.findById(req.params.id);

        if(!note){
            res.status(404);
            throw new Error("Note not found");
        }

        if(note.user.toString() !== req.user._id.toString()){
            res.status(401);
            throw new Error("You are not authorized to update this note.");
        }

        note.title = title || note.title;
        note.content = content || note.content;
        
        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    }
    catch(error){
        console.error("Error in updateNote controller:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

//Delete note function
export async function deleteNote(req, res) {
    try{
        const note = await Note.findById(req.params.id)

        if(!note){
            res.status(404);
            throw new Error("Note not found");
        }

        if(note.user.toString() !== req.user._id.toString()){
            res.status(401);
            throw new Error("You are not authorized to delete this note");
        }

        await note.deleteOne(); //Use deleteOne() on the document
        res.json({ message: "Note deleted successfully"});
    }
    catch (error) {
        console.error("Error in deleteNote controller:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}