import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try{
        // Use user ID if authenticated, otherwise use IP
        let key;
        if(req.user && req.user._id){
            key = `user:${req.user._id}`;
        }
        else{
            key = `ip:${req.ip}`;
        }

        // Apply the limit
        const { success, limit, remaining, reset } = await ratelimit.limit(key);

        if (!success) {
            return res.status(429).json({
                message: "Too many requests. Please try again later.",
                limit,
                remaining,
                reset,
            });
        }

        next();
    } catch (error) {
        console.log("Rate limit error", error);
        next(error);
    }
};

export default rateLimiter;