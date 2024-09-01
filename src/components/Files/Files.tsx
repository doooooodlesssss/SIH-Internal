import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, Alert, Button } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useUser from '../../hooks/useUser';
import { getFilesKeysFromFirestore, uploadFileToCloud, downloadFileFromFirebase, deleteFileFromFirebase } from '../../firebase/firestore';
import * as AppGeneral from "../socialCalc/index.js";
import { DATA } from "../../app-data.js";

const Files = (props: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [listFiles, setListFiles] = useState(false);
  const [showAlert1, setShowAlert1] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);
  const { user, isLoading } = useUser();
  const editFile = (key: any) => {
    props.store._getFile(key).then((data: any) => {
      // AppGeneral.viewFile(key, decodeURIComponent((data as any).content));
      props.updateSelectedFile(key);
      props.updateBillType((data as any).billType);
    });
  };

  const moveFileToCloud = (key: any) => {
    props.store._getFile(key).then((fileData: any) => {
      if (user) {
        uploadFileToCloud(user, fileData, () => {
          Alert.alert('File Uploaded to Cloud');
          setListFiles(false);
        });
      } else {
        Alert.alert('Login to Continue');
        setListFiles(false);
      }
    });
  };
  
  const deleteFile = (key: any) => {
    setShowAlert1(true);
    setCurrentKey(key);
  };

  const loadDefault = () => {
    const msc = (DATA as any)['home'][AppGeneral.getDeviceType()]['msc'];
    // AppGeneral.viewFile('default', JSON.stringify(msc));
    props.updateSelectedFile('default');
  };

  const _formatDate = (date: any) => {
    return new Date(date).toLocaleString();
  };

  const temp = async () => {
    let files: any;
    if (props.filesFrom === 'Local') {
      files = await props.store._getAllFiles();
    } else if (props.filesFrom === 'Cloud') {
      if (isLoading) return;
      if (!user) {
        Alert.alert('Login to Continue');
      } else {
        files = await getFilesKeysFromFirestore(user.uid);
      }
    }
    const fileList = Object.keys(files).map((key) => {
      return (
        <TouchableOpacity key={key} onPress={() => editFile(key)}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{key}</Text>
            <Text>{_formatDate(files[key])}</Text>
            {props.filesFrom === 'Local' && (
              <Ionicons name="create" size={24} color="#4F8EF7" onPress={() => {
                setListFiles(false);
                editFile(key);
              }}/>
            )}
            <Ionicons name={props.filesFrom === 'Local' ? 'cloud-upload' : 'cloud-download'} 
                size={24} color="#4F8EF7" 
                onPress={() => {
                  if (props.filesFrom === 'Local') moveFileToCloud(key);
                  else {
                    if (user){
                      downloadFileFromFirebase(user.uid, key, () => setListFiles(false))
                    } else {
                      Alert.alert('Login to Continue');
                    }
                  };
              }} />
            <Ionicons 
              name="trash" 
              size={24} 
              color="black"
              onPress={() => {
                setListFiles(false);
                deleteFile(key);
              }}
            />
          </View>
        </TouchableOpacity>
      );
    });

    const ourModal = (
      <Modal visible={listFiles} onRequestClose={() => setListFiles(false)}>
        <FlatList
          data={FileList as any}
          renderItem={({ item }) => item}
          keyExtractor={(item) => item.key}
        />
        <TouchableOpacity onPress={() => setListFiles(false)}>
          <Text>Back</Text>
        </TouchableOpacity>
      </Modal>
    );
      setModalVisible(true);
    };

  useEffect(() => {
    temp();
  }, [listFiles]);
  
  return (
    <View>
      <TouchableOpacity onPress={() => setListFiles(true)}>
        <Ionicons name={props.filesFrom === 'Local' ? 'file-tray-full' : 'cloud-download'} 
          size={24} 
          color="#4F8EF7"
        />
      </TouchableOpacity>
      {modalVisible && (
        <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          {ourModal}
        </Modal>
      )}
      {showAlert1 && (
        <Alert
          title="Delete file"
          message={`Do you want to delete the ${currentKey} file?`}
          buttons={[
            { text: 'No', onPress: () => setShowAlert1(false) },
            {
              text: 'Yes',
              onPress: () => {
                if (props.filesFrom === 'Local') {
                  props.store._deleteFile(currentKey);
                  loadDefault();
                  setCurrentKey(null);
                } else {
                  deleteFileFromFirebase(user.uid, currentKey, () => {
                    setListFiles(false);
                    loadDefault();
                    setCurrentKey(null);
                  });
                }
              },
            },
          ]}
        />
      )}
    </View>
  );
};

export default Files;            