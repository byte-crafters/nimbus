// import router from "next/router";
// import { FormEvent } from "react";
// import { register } from "../lib/register-actions";

// export const onRegister = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     const userProfile = await register(loginRef.current!.value, passwordRef.current!.value);

//     if (userProfile !== null) {
//         setLoggedUser?.(userProfile.id);
//         setOpenedFolder?.(userProfile.rootFolder);
//         router.push('/files');
//     }
// };