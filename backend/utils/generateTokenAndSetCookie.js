import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	const isProd = process.env.NODE_ENV === "production";
	const cookieOptions = {
		httpOnly: true,
		secure: isProd, // only secure in production
		sameSite: isProd ? "none" : "lax", // lax works for localhost cross-port
		maxAge: 7 * 24 * 60 * 60 * 1000,
	};

	res.cookie("token", token, cookieOptions);

	return token;
};
