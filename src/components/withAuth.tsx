import { useEffect } from "react";
import { ReactElement } from "react";

// For frontend
export const withAuth = (WrappedComponent: ReactElement) => {
	const Wrapper = (props: any) => {
		useEffect(() => {
			const jwt = localStorage.getItem("accessToken");
			console.log(jwt);

			// if (!token) {
			// } else {
			// 	try {
			// 		const decoded: JwtPayload = jwt.verify(
			// 			token,
			// 			process.env.JWT_SECRET!
			// 		) as JwtPayload;
			// 		props.user = decoded.username;
			// 	} catch (err) {
			// 		router.push("/login");
			// 	}
			// }
		}, []);

		return WrappedComponent;
	};

	return Wrapper;
};

export default withAuth;
