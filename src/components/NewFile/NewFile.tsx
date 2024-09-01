import React, { useState } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import * as AppGeneral from '../socialCalc/index.js';
import { File, Local } from '../Storage/LocalStorage';
import { DATA } from '../../app-data.js';
import AntDesign from '@expo/vector-icons/AntDesign';


interface NewFileProps {
  file: string;
  store: Local;
  updateSelectedFile: (file: string) => void;
  billType: number;
}

const NewFile: React.FC<NewFileProps> = (props) => {
  const [showAlertNewFileCreated, setShowAlertNewFileCreated] = useState(false);

  const newFile = () => {
    if (props.file !== "default") {
      const content = encodeURIComponent(AppGeneral.getSpreadsheetContent());
      const data = props.store._getFile(props.file);
      const file = new File(
        (data as any).created,
        new Date().toString(),
        content,
        props.file,
        props.billType
      );
      props.store._saveFile(file);
      props.updateSelectedFile(props.file);
    }
    const msc = (DATA as any)["home"][AppGeneral.getDeviceType()]["msc"];
    AppGeneral.viewFile("default", JSON.stringify(msc));
    props.updateSelectedFile("default");
    setShowAlertNewFileCreated(true);
  };

  React.useEffect(() => {
    if (showAlertNewFileCreated) {
      Alert.alert(
        "Alert Message",
        "New file created!",
        [
          { text: "OK", onPress: () => setShowAlertNewFileCreated(false) }
        ]
      );
    }
  }, [showAlertNewFileCreated]);

  return (
    <View>
      <TouchableOpacity onPress={() => newFile()}>
        <AntDesign name="addfile" size={30} color="#4F8EF7" style={{ marginRight: 10 }} />
      </TouchableOpacity>
    </View>
  );
};

export default NewFile;
