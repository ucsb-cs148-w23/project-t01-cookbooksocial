import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { generateAvatar } from "../../utils/GenerateAvatar";

import styles from "./ProfilePic.module.css";

import {db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore"; 

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfilePic() {
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, updateUserProfile, setError } = useAuth();


  useEffect(() => {
    const fetchData = () => {
      const res = generateAvatar();
      setAvatars(res);
    };

    fetchData();
  }, []);

  const picClicked = (index) => {
    setSelectedAvatar(index);
    console.log("Clicked: ", index);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedAvatar === undefined) {
      return setError("Please select an avatar");
    }

    try {
      setError("");
      setLoading(true);
      const user = currentUser;
      const profile = {
        displayName: username ? username : currentUser.displayName,
        photoURL: avatars[selectedAvatar],
      };
      await updateUserProfile(user, profile);
      //update user's firestore doc with new profile photo and display name
      const userRef = doc(db, "users", currentUser.uid);
      setDoc(userRef, { profile: profile }, { merge: true });
      navigate("/home");
    } catch (e) {
      setError("Failed to update profile");
    }

    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="">
        <div className="text-center">
          <h2 className="mt-4 text-3xl text-center tracking-tight font-light dark:text-white">
            Pick an avatar
          </h2>
        </div>

        <form className="" onSubmit={handleFormSubmit}>
          <div className={styles.imagesContainer}>
            {avatars.map((avatar, index) => (
              <div key={index}>
                <div className={styles.picSize}>
                  <img
                    alt="gallery"
                    className={classNames(
                      index === selectedAvatar ? styles.picChosen : styles.picNotChosen
                    )}
                    src={avatar}
                    onClick={() => picClicked(index)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.nameField}>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="px-3 py-2 border border-gray-300"
              placeholder="Enter a Display Name"
              defaultValue={currentUser.displayName && currentUser.displayName}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 border border-transparent"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
