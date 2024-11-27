import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })

        console.log("File is uploaded on cloudinary!", response.url);

        // remove the file from the temp folder
        fs.unlinkSync(localFilePath)
        return response;
        
    } catch (err) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export { uploadOnCloudinary }