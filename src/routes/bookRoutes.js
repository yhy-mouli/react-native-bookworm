import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import protectRoute from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", protectRoute, async(req, res)=> {
    try {
        const {image, title, rating, caption} = req.body;
    if(!image || !title || !rating || caption){
        return res.status(400).json({message : "All fields are required"});
    }
    // Upload the image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;
    // Save to DB
    const newBook = new Book({
        title,
        caption,
        rating,
        image : imageUrl,
        user : req.user_id,
    });
    await newBook.save();
    } catch (error) {
        console.log("error creating book", error);
        res.status(500).json({message : error.message});
    }
    

});

router.get("/", protectRoute, async (req, res)=>{
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });    
    } catch (error) {
        console.log("Error in get all books route", error);
        res.status(500).json({ message: "Internal server error"});
    }
});

// get recommended books by  the logged in user
router.get("/user", async(req, res)=>{
    try {
        const books = await book.find({user: req.user._id}).sort({createdAt: -1});
        res.json(books);
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
});

router.delete("/:id", protectRoute, async(req,res)=>{
    try {
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).json({ message: "Book not found"});

        //check if the user is the creator of the book
        if(book.user.toString() !== req.user._id.toString())
            return res.status(401).json({ message: "Unauthorized"});

        //Delete the image from the cloudinary
        if(book.image && book.image.includes("cloudinary")){
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
              console.log("Error deleting image from cloudinary", deleteError);
              res.status(500).json({message: "Internal Server Error!!!"});  
            }
        }

        await book.deleteOne();
        res.json({message: "Book deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
});


export default router;