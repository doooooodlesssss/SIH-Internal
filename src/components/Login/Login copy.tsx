import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Modal,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import LoginFormComponent from "./LoginFormComponent";  // Assume this is adapted for React Native
import {
  logOut,
  signUpWithEmailAndPassword,
  loginWithEmailPassword,
} from "../../firebase/auth";
import useUser from "../../hooks/useUser";

const Login: React.FC = () => {
  const { user, isLoading } = useUser();
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const doSignIn = async (email: string, password: string) => {
    try {
      await loginWithEmailPassword(email, password);
      closeLoginModal();
    } catch {
      console.error("Something Went Wrong");
    }
  };

  const doSignUp = async (email: string, password: string) => {
    try {
      await signUpWithEmailAndPassword(email, password);
      closeLoginModal();
    } catch {
      console.error("Something Went Wrong");
    }
  };

  const closeLoginModal = () => setOpenLoginModal(false);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={async () => {
          if (!user) {
            setOpenLoginModal(true);
          } else {
            try {
              await logOut();
            } catch {
              console.error("Something Went Wrong");
            }
          }
        }}
      >
        <FontAwesome6 name="person" size={30} color="#000" />
        <Text style={styles.buttonText}>{user ? "Logout" : "Login"}</Text>
      </TouchableOpacity>

      <Modal
        visible={openLoginModal}
        animationType="slide"
        onRequestClose={closeLoginModal}
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <LoginFormComponent handleSignUp={doSignUp} handleLogin={doSignIn} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default Login;
