import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions, Animated, Keyboard, KeyboardEvent, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

const { width, height } = Dimensions.get('window');

const AICaddieChat: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [animation] = useState(new Animated.Value(width));
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        Animated.timing(animation, {
            toValue: isOpen ? 0 : width,
            duration: 300,
            useNativeDriver: true,
        }).start();

        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e: KeyboardEvent) => setKeyboardHeight(e.endCoordinates.height)
        );
        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardHeight(0)
        );

        return () => {
            keyboardWillShowListener.remove();
            keyboardWillHideListener.remove();
        };
    }, [isOpen]);

    const handleClose = () => {
        Keyboard.dismiss();
        onClose();
    }

    const sendMessage = () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: inputText.trim(),
                sender: 'user',
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setInputText('');

            // Simulate AI response
            setTimeout(() => {
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: "Hit your driver dumbass...",
                    sender: 'ai',
                };
                setMessages(prevMessages => [...prevMessages, aiResponse]);
            }, 1000);

            // Scroll to the bottom of the list
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    const inputContainerPosition = keyboardHeight > 0
        ? keyboardHeight * 1.15 + insets.bottom
        : height * 0.15 + insets.bottom;

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateX: animation }] }
            ]}
        >
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                style={styles.messageList}
                contentContainerStyle={[
                    styles.messageListContent,
                    { paddingBottom: inputContainerPosition + 60 }
                ]}
            />
            <Animated.View style={[
                styles.inputContainer,
                { bottom: inputContainerPosition }
            ]}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Ask your AI caddie..."
                    placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Ionicons name="send" size={24} color="#2E7D32" />
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 80,
        left: 0,
        width: width,
        height: height,
        backgroundColor: 'transparent',
    },
    closeButton: {
        position: 'absolute',
        top: -7,
        right: 25,
        zIndex: 1,
        backgroundColor: '#2E7D32',
        borderRadius: 25,
        padding: 5,
    },
    messageList: {
        flex: 1,
    },
    messageListContent: {
        paddingTop: 80,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: 'rgba(220, 248, 198, 0.9)',
    },
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(224, 224, 224, 0.9)',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    inputContainer: {
        position: 'absolute',
        left: 10,
        right: 10,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 25,
    },
    input: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: '#333',
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});

export default AICaddieChat;
