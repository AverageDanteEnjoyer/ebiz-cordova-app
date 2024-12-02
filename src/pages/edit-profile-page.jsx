import React, { useState, useEffect, useCallback } from 'react';
import { Page, Navbar, Block, List, ListInput, Button, f7 } from 'framework7-react';
import { api } from '@/utils/api';
import { ApiURL, staticURL } from '../utils/api';

const EditProfilePage = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    imagePath: null,
    bio: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const sessionUser = JSON.parse(sessionStorage.getItem("user"));

  const fetchUser = useCallback(async () => {
    const response = await api.get('/users/me');
    const data = await response.json();
    setUser(data);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    setImageFile(new Blob([e.target.files[0]]));
  };

  const handleSave = async () => {
    if (user.firstName.trim() === "" || user.lastName.trim() === "" || user.email.trim() === "") {
      f7.dialog.alert('Please fill in all fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append(
        "user",
        JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          bio: user.bio,
          ...(user.password && { password: user.password }),
        })
      );

      formData.append("image", imageFile || new Blob());

      const response = await fetch(`${ApiURL}/users/${user.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Authorization": `Bearer ${sessionUser.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        f7.dialog.alert('Profile updated successfully');
      } else {
        f7.dialog.alert('Failed to update profile');
      }
    } catch (error) {
      f7.dialog.alert('An error occurred. Please try again later.');
    }
  };

  const proileImage = `${staticURL}/${user.imagePath ?? "default.jpg"}`

  return (
    <Page name="profile">
      <Navbar title="Edit Profile" backLink="Back" />
      <Block strong inset>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={proileImage} alt="abc" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />
        </div>
        <List form>
          <ListInput
            label="Bio"
            type="text"
            name="bio"
            placeholder="Tell us more about yourself..."
            value={user.bio}
            onInput={handleInputChange}
          />
          <ListInput
            label="First Name"
            type="text"
            name="firstName"
            placeholder="First Name"
            value={user.firstName}
            onInput={handleInputChange}
          />
          <ListInput
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={user.lastName}
            onInput={handleInputChange}
          />
          <ListInput
            label="Email"
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onInput={handleInputChange}
          />
          <ListInput
            label="Profile Picture"
            type="file"
            name="image"
            accept="image/*;capture=camera"
            onChange={handleImageChange}
          />
        </List>
        <Button type="submit" fill onClick={handleSave}>Save changes</Button>
      </Block>
    </Page>
  );
};

export default EditProfilePage;