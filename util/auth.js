import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { storeData, getData } from "./storage";

const reautenticate = async (app) => {
  const user = await getData("user");
  if (user !== null) {
    await authLogin(app, user.email, user.passwordText);
  }
};

const userIsLoggedIn = async () => {
  const result = await getData("user");
  return result;
};

const authLogin = async (app, emailText, passwordText) => {
  const auth = getAuth(app);

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      emailText,
      passwordText
    );
    const { displayName, email, phoneNumber, photoURL, uid } = auth.currentUser;
    storeData("user", {
      displayName,
      email,
      phoneNumber,
      photoURL,
      uid,
      passwordText,
    });
    return {
      status: 200,
      message: "Usuário logado com sucesso!",
    };
  } catch (err) {
    let message = "Erro ao realizar registro";
    // console.log(err.toString());

    if (err.toString().indexOf("auth/invalid-email") > -1) {
      message = "Dados inválidos";
    }

    return {
      status: 400,
      message: message,
    };
  }
};

const authRegister = async (app, emailCreate, password) => {
  const auth = getAuth(app);
  
  try {
    const result = await createUserWithEmailAndPassword(auth, emailCreate, password);
    const { displayName, email, phoneNumber, photoURL, uid, passwordText } = auth.currentUser;
    storeData("user", {
      displayName,
      email,
      phoneNumber,
      photoURL,
      uid,
      passwordText,
    });
    return {
      status: 200,
      message: "Usuário criado com sucesso!",
    };
      } catch (err) {
         let message = "Erro ao realizar login";
    // console.log(err.toString());

    if (err.toString().indexOf("auth/invalid-email") > -1) {
      message = "Dados inválidos";
    }
    return {
      status: 400,
      message: message,
    };
  }
};

const authLogout = () => {
  storeData("user", null);
};

export { authLogin, authRegister, userIsLoggedIn, authLogout, reautenticate };
