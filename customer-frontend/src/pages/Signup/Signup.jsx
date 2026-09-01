import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../firebase";

import "../Login/Login.css";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e) =>
    setData({
      ...data,
      [e.target.name]: e.target.value
    });

  async function submit(e) {
    e.preventDefault();

    if (Object.values(data).some((x) => !x)) {
      return setMessage("Please complete every field.");
    }

    if (data.password !== data.confirm) {
      return setMessage("Passwords do not match.");
    }

    try {
      setLoading(true);
      setMessage("");

      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // 2. Save additional user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: "customer",
        createdAt: serverTimestamp()
      });

      // 3. Redirect to customer dashboard
      navigate("/customer");

    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setMessage("This email is already registered.");
      } else if (error.code === "auth/weak-password") {
        setMessage("Password should be at least 6 characters.");
      } else {
        setMessage("Signup failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>

        <Link className="auth-brand" to="/customer">
          Skill<span>Build</span>
        </Link>

        <h1>Create account</h1>

        <p className="intro">
          Set up your customer account.
        </p>

        {message && (
          <p className="error-state">
            {message}
          </p>
        )}

        {[
          ["name", "Full name", "text"],
          ["email", "Email address", "email"],
          ["phone", "Phone number", "tel"],
          ["password", "Password", "password"],
          ["confirm", "Confirm password", "password"]
        ].map(([n, l, type]) => (
          <label key={n}>
            {l}

            <input
              required
              name={n}
              type={type}
              value={data[n]}
              onChange={update}
            />
          </label>
        ))}

        <button
          className="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Log in
          </Link>
        </p>

      </form>
    </div>
  );
}