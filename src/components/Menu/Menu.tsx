import React, { useState } from "react";
import * as AppGeneral from "../socialCalc/index.js";
import { File, Local } from "../Storage/LocalStorage";
import { APP_NAME } from "../../app-data.js";
import { Platform, Alert, Button, Modal, View, Text, TextInput, StyleSheet } from "react-native";
import Toast from "react-native-simple-toast";
import * as MailComposer from "expo-mail-composer";
import * as Print from "expo-print";
import { useActionSheet } from "@expo/react-native-action-sheet";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Menu: React.FC<{
    showM: boolean;
    setM: Function;
    file: string;
    updateSelectedFile: Function;
    store: Local;
    bT: number;
  }> = (props) => {
    const [showAlert1, setShowAlert1] = useState(false);
    const [showAlert2, setShowAlert2] = useState(false);
    const [showAlert3, setShowAlert3] = useState(false);
    const [showAlert4, setShowAlert4] = useState(false);
    const [filename, setFilename] = useState('');
    const [showToast1, setShowToast1] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    /* Utility functions */
    const _validateName = async (filename: any) => {
      filename = filename.trim();
      if (filename === "default" || filename === "Untitled") {
        setToastMessage("Cannot update default file!");
        return false;
      } else if (filename === "" || !filename) {
        setToastMessage("Filename cannot be empty");
        return false;
      } else if (filename.length > 30) {
        setToastMessage("Filename too long");
        return false;
      } else if (/^[a-zA-Z0-9- ]*$/.test(filename) === false) {
        setToastMessage("Special Characters cannot be used");
        return false;
      } else if (await props.store._checkKey(filename)) {
        setToastMessage("Filename already exists");
        return false;
      }
      return true;
    };
  
    const { showActionSheetWithOptions } = useActionSheet();
    const showActionSheet = () => {
      const options = [
        {
          text: "Save",
          icon: <AntDesign name="save" color="black"/>,
          onPress: () => {
            doSave();
            console.log("Save clicked");
          },
        },
        {
          text: "Save As",
          icon: <MaterialIcons name="save-as" color="black" />, // Replace with actual icon component
          onPress: () => {
            setShowAlert3(true);
            console.log("Save As clicked");
          },
        },
        {
          text: "Print",
          icon: <MaterialIcons name="print" color="black" />, // Replace with actual icon component
          onPress: () => {
            doPrint();
            console.log("Print clicked");
          },
        },
        {
          text: "Email",
          icon: <AntDesign name="mail" color="black" />, // Replace with actual icon component
          onPress: () => {
            sendEmail();
            console.log("Email clicked");
          },
        },
        {
          text: "Cancel",
          icon: null,
          onPress: () => {
            console.log("Cancel clicked");
          },
          style: 'cancel',
        }
      ];
  
      showActionSheetWithOptions(
        {
          options: options.map(option => option.text),
          icons: options.map(option => option.icon),
          cancelButtonIndex: options.length - 1,
        },
        buttonIndex => {
          if (buttonIndex !== undefined && buttonIndex >= 0 && buttonIndex < options.length) {
            options[buttonIndex].onPress();
          }
        }
      );
    };

    const getCurrentFileName = () => {
      return props.file;
    };
  
    const _formatString = (filename: any) => {
      /* Remove whitespaces */
      while (filename.indexOf(" ") !== -1) {
        filename = filename.replace(" ", "");
      }
      return filename;
    };
  
    const doPrint = async () => {
        await Print.printAsync(AppGeneral.getCurrentHTMLContent());
    };
    const doSave = () => {
      if (props.file === "default") {
        setShowAlert1(true);
        return;
      }
      const content = encodeURIComponent(AppGeneral.getSpreadsheetContent());
      const data = props.store._getFile(props.file);
      const file = new File(
        (data as any).created,
        new Date().toString(),
        content,
        props.file,
        props.bT
      );
      props.store._saveFile(file);
      props.updateSelectedFile(props.file);
      setShowAlert2(true);
    };
  
    const doSaveAs = async (filename: any) => {
      // event.preventDefault();
      if (filename) {
        // console.log(filename, _validateName(filename));
        if (await _validateName(filename)) {
          // filename valid . go on save
          const content = encodeURIComponent(AppGeneral.getSpreadsheetContent());
          // console.log(content);
          const file = new File(
            new Date().toString(),
            new Date().toString(),
            content,
            filename,
            props.bT
          );
          // const data = { created: file.created, modified: file.modified, content: file.content, password: file.password };
          // console.log(JSON.stringify(data));
          props.store._saveFile(file);
          props.updateSelectedFile(filename);
          setShowAlert4(true);
        } else {
          setShowToast1(true);
        }
      }
    };
  
    const sendEmail = async () => {
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        const content = AppGeneral.getCurrentHTMLContent();
        const base64 = btoa(content);
  
        await MailComposer.composeAsync({
            recipients: ["jackdwell08@gmail.com"],
            ccRecipients: [],
            bccRecipients: [],
            body: "PFA",
            attachments: [base64],
            subject: `${APP_NAME} attached`,
        });
      } else {
        alert("This Functionality works on Anroid/IOS devices");
      }
    };
  
    return (
      <React.Fragment>
        <Button title="Show Action Sheet" onPress={showActionSheet} />
        <Button title="Show Alert" disabled={!showAlert1} onPress={() => {
          setShowAlert1(true);
          Alert.alert(
            "Alert Message",
            `Cannot update ${getCurrentFileName()} file!`,
            [
              { text: "Ok", onPress: () => setShowAlert1(false) }
            ]
          );
        }}>
        </Button>
        <Button title="Show Alert" disabled={!showAlert2} onPress={() => {
          setShowAlert2(true);
          Alert.alert(
            "Alert Message",
            `File <strong>${getCurrentFileName()}</strong> updated succesfully`,
            [
              { text: "Ok", onPress: () => setShowAlert2(false) }
            ]
          );
        }}>
        </Button>
        <Button title="fdf" ></Button>
        <Button title="Show Alert" disabled = {!showAlert4} onPress={() => {
          setShowAlert4(true);
          Alert.alert(
            "Save As",
            `File <strong>${getCurrentFileName()}</strong> saved succesfully!`,
            [
              { text: "Ok", onPress: () => setShowAlert4(false) }
            ]
          );
        }}>
        </Button>
        <Button title="Show Save As" onPress={() => setShowAlert3(true)} />

        <Modal
          transparent={true}
          visible={showAlert3}
          animationType="slide"
          onRequestClose={() => setShowAlert3(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.header}>Save As</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter filename"
                value={filename}
                onChangeText={setFilename}
              />
              <Button
                title="Ok"
                onPress={() => {
                  doSaveAs(filename);
                  setShowAlert3(false);
                  setFilename(''); // Clear input field
                }}
              />
              <Button
                title="Cancel"
                onPress={() => setShowAlert3(false)}
              />
            </View>
          </View>
        </Modal>
        <Button title="Show Toast" disabled = { !showToast1 }onPress={ () => {
            Toast.show(toastMessage, Toast.SHORT);  // Show the toast
            setTimeout(() => {
              setShowToast1(false);
              setShowAlert3(true); // Change state after toast duration
            }, 500); // Match the duration of the toast
          }} />
      </React.Fragment>
    );
  };
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});
export default Menu;