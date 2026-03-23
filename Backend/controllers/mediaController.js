import cloudinary from "../config/cloudinary.js";

const uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required",
            });
        }

        const bgRemove = req.body.bgRemove === "true" || req.body.bgRemove === true;

        const bgGenerate = req.body.bgGenerate === "true" || req.body.bgGenerate === true;

        const bgPrompt = req.body.bgPrompt || "plain white background";

        const folder = req.body.folder || "products";

        let uploadOptions = {
            folder: "ecommerce/" + folder,
            resource_type: "image",
        };

        // 🧠 Priority logic
        if (bgGenerate) {
            // ✅ Generative background replace (AI)
            uploadOptions.transformation = [
                {
                    effect: "gen_background_replace",
                    prompt: bgPrompt,
                },
            ];
        } else if (bgRemove) {
            // ✅ AI background removal
            uploadOptions.transformation = [
                { effect: "background_removal" },
                { background: req.body.bgColor && "white" },
            ];
        }

        const result = await cloudinary.uploader.upload(
            req.file.path,
            uploadOptions
        );

        return res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: {
                public_id: result.public_id,
                url: result.secure_url,
                applied: bgGenerate
                    ? "GENERATIVE_BACKGROUND"
                    : bgRemove
                        ? "BACKGROUND_REMOVED"
                        : "ORIGINAL",
            },
        });
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        return res.status(500).json({
            success: false,
            message: "Image upload failed",
            error: error.message,
        });
    }
};

export { uploadMedia };
