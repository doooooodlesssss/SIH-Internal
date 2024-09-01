import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

interface ComponentProps {
  handleLogin: (email: string, password: string) => void;
  handleSignUp: (email: string, password: string) => void;
}

const LoginFormComponent: React.FC<ComponentProps> = ({
  handleLogin,
  handleSignUp,
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const updateValue = (
    e: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => updateValue(text, setEmail)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => updateValue(text, setPassword)}
        secureTextEntry={true}
      />
      <Button title="Login" onPress={() => handleLogin(email, password)} />
      <Button title="Sign Up" onPress={() => handleSignUp(email, password)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});

export default LoginFormComponent;

