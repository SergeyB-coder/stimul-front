/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/style-prop-object */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './style.css'
import { getAllMessages, getChats, getMessages, sendMessage, sendMessageFile, sendMessageTest, sendMessageWA } from './startApi';
import { useSocket } from './useSocket';
import { selectUserId, selectUserName } from './startSlice';
import { useNavigate } from 'react-router-dom';


interface Msg {
    text: string,
    name: string,
    chat_id: number,
    id: number,
    file_content: string
}

interface Cht {
    name: string,
    id: number,
    q_not_read: number
}

let current_chat = 1
let state_alarm = false
let alarmInterval: any
let all_messages: Msg[]
let chats_: Cht[]

export function Start() {
    const navigate = useNavigate()
    const { socket } = useSocket()

    const userName = useSelector(selectUserName)
    const userId = useSelector(selectUserId)

    const [chats, setChats] = useState<Cht[]>([]);
    const [message, setMessage] = useState('');
    const [uploadFile, setUploadFile] = useState<any>(null);
    const [currentChatId, setCurrentChatId] = useState(1);
    const [chatMessages, setChatMessages] = useState<any>([]);

    const [newMessageChatId, setNewMessageChatId] = useState(0);
    const [findText, setFindText] = useState('');
    const [findChatText, setFindChatText] = useState('');

    const [serverOn, setServerOn] = useState(true)

    const [qoutedMessageIndex, setQoutedMessageIndex] = useState(0);
    const [findChatsMsg, setfindChatsMsg] = useState<Msg[]>([]);

    function handleScroll() {
        console.log('handleScroll')
        var objDiv = document.getElementById("messages");
        // console.log('objDiv.scrollTop', objDiv.scrollHeight, objDiv.scrollTop, left_ind)

        if (objDiv) {
            console.log('objDiv.scrollTop', objDiv.scrollHeight, objDiv.scrollTop)
            if (objDiv.scrollTop > objDiv.scrollHeight - 600) {
                console.log('bottom')
                clearInterval(alarmInterval)
                alarmInterval = 0
                setDefaultIcon()
                getChats({ user_id: userId }, (data) => {
                    setChats(data.chats)
                    chats_ = data.chats
                })
            }
        }

    }

    function scrollToBottom() {
        clearInterval(alarmInterval)
        alarmInterval = 0
        setDefaultIcon()

        var objDiv = document.getElementById("messages");
        if (objDiv) objDiv.scrollTop = objDiv.scrollHeight
        getChats({ user_id: userId }, (data) => {
            setChats(data.chats)
            chats_ = data.chats
        })
    }

    // const [alarmInterval, setAlarmInterval] = useState<any>(undefined);

    function goUpChat(chat_id: number) {
        let arr_cht = chats.slice()
        const ind = arr_cht.findIndex(e => e.id === chat_id)
        let el_up = arr_cht[ind]
        for (let i = ind; i > 0; i--) {
            arr_cht[i] = arr_cht[i - 1]
        }
        arr_cht[0] = el_up
        setChats(arr_cht)
        chats_ = arr_cht
    }

    function goUpChatS(chat_id: number) {
        let arr_cht = chats_.slice()
        const ind = arr_cht.findIndex(e => e.id === chat_id)
        let el_up = arr_cht[ind]
        for (let i = ind; i > 0; i--) {
            arr_cht[i] = arr_cht[i - 1]
        }
        arr_cht[0] = el_up
        setChats(arr_cht)
        chats_ = arr_cht
    }

    const handleClickSendMessage = () => {
        if (uploadFile) {
            goUpChat(currentChatId)
            sendMessageFile({ upload_file: uploadFile, chat_id: currentChatId, user_id: userId }, (data) => {
                setUploadFile(false)
                let file = document.getElementById("myfile") as HTMLInputElement
                file.value = ''
                getMessages({ chat_id: currentChatId, user_id: userId }, (data) => {
                    setChatMessages(data.messages)
                    setTimeout(() => {
                        var objDiv = document.getElementById("messages");
                        if (objDiv) objDiv.scrollTop = objDiv.scrollHeight
                    }, 1000)
                })
            })

        }
        else if (message.trim() === '') return
        else {
            goUpChat(currentChatId)
            setMessage('')
            let inp = document.getElementById('inputmessage')
            if (inp) inp.style.height = '5vh'

            const quoted_msg_id = qoutedMessageIndex === 0 ? '' : chatMessages[qoutedMessageIndex].message_id
            const serialized_id = qoutedMessageIndex === 0 ? '' : chatMessages[qoutedMessageIndex].serialized_id

            sendMessage({ text: message, chat_id: currentChatId, quoted_msg_id: quoted_msg_id, user_id: userId }, (data) => {
                setQoutedMessageIndex(0)
                console.log('insert_id', data)
                const insert_id = data.id
                getMessages({ chat_id: current_chat, user_id: userId }, (data) => {
                    setChatMessages(data.messages)
                    sendMessageWA({ text: `*${userName}*\n${message}`, chat_id: currentChatId, id: insert_id, serialized_id: serialized_id }, (data) => {
                        if (data.res) setServerOn(true)
                        else {
                            setServerOn(false)
                            alert('Сообщение: ' + message + ' не прошло. Сервер отключен')
                        }
                    })
                    setTimeout(() => {
                        var objDiv = document.getElementById("messages");
                        if (objDiv) objDiv.scrollTop = objDiv.scrollHeight
                    }, 1000)
                })
            })
        }

    }

    function setDefaultIcon() {
        const favicon = document.getElementById("icon");
        if (favicon) favicon.setAttribute("href", "favicon.ico");
    }

    function alarmNewMsg() {
        console.log('alarm')
        const favicon = document.getElementById("icon");
        if (state_alarm) {
            if (favicon) favicon.setAttribute("href", "newmsg.ico");
        }
        else {
            if (favicon) favicon.setAttribute("href", "favicon.ico");
        }
        state_alarm = !state_alarm
    }

    const handleSocket = (arg: any) => {
        goUpChatS(parseInt(arg.chat_id))
        getChats({ user_id: userId }, (data) => {
            setChats(data.chats)
            chats_ = data.chats
        })
        console.log('arg', arg, current_chat, current_chat === parseInt(arg.chat_id))
        if (current_chat === parseInt(arg.chat_id)) {
            getMessages({ chat_id: arg.chat_id, user_id: userId }, (data) => {
                setChatMessages(data.messages)

                // var objDiv = document.getElementById("messages");
                // if (objDiv) objDiv.scrollTop = objDiv.scrollHeight
            })
        }

        const favicon = document.getElementById("icon");
        if (favicon) {
            console.log('favicon')
            favicon.setAttribute("href", "newmsg.ico");
        }
        clearInterval(alarmInterval)
        alarmInterval = 0
        // setAlarmInterval(undefined)
        if (alarmInterval === 0) {
            const interval = setInterval(() => alarmNewMsg(), 1000)
            alarmInterval = interval
        }


        // if (parseInt(arg.chat_id) !== current_chat) {

        // setNewMessageChatId(arg.chat_id)
        // }


    }

    const handleClickChatItem = (chat_id: number) => {
        clearInterval(alarmInterval)
        alarmInterval = 0
        setDefaultIcon()

        current_chat = chat_id
        setCurrentChatId(chat_id)
        if (chat_id !== currentChatId) setNewMessageChatId(0)

        getMessages({ chat_id: chat_id, user_id: userId }, (data) => {
            setChatMessages(data.messages)

            getChats({ user_id: userId }, (data) => {
                setChats(data.chats)
                chats_ = data.chats
            })

            setTimeout(() => {
                var objDiv = document.getElementById("messages");
                if (objDiv) objDiv.scrollTop = objDiv.scrollHeight
            }, 1000)
        })
    }

    const handleClickFindChat = (chat_id: number, msg_id: number) => {
        current_chat = chat_id
        setCurrentChatId(chat_id)
        getMessages({ chat_id: chat_id, user_id: userId }, (data) => {
            setChatMessages(data.messages)
            setTimeout(() => {
                var objDiv = document.getElementById("messages");
                const divMessage = document.getElementById('mess' + msg_id.toString())
                if (divMessage && objDiv) objDiv.scrollTop = divMessage.offsetTop - 100;
                if (divMessage) {
                    divMessage.classList.add('find_message')
                    setTimeout(() => divMessage.classList.remove('find_message'), 5000)
                }
            }, 1000)
        })
    }

    const handleFind = (e: any) => {
        setFindText(e.target.value)
        let is_find = 0
        var objDiv = document.getElementById("messages");

        for (let i = 0; i < chatMessages.length; i++) {
            if (chatMessages[i].text.toLowerCase().includes(e.target.value) && !chatMessages[i].is_file) {
                is_find = chatMessages[i].id
                break
            }
        }

        if (is_find !== 0 && objDiv) {
            const divMessage = document.getElementById('mess' + is_find.toString())

            if (divMessage) objDiv.scrollTop = divMessage.offsetTop - 100;

            if (divMessage) {
                divMessage.classList.add('find_message')
                setTimeout(() => divMessage.classList.remove('find_message'), 5000)
            }
        }
    }


    const handleFindChat = (e: any) => {
        setFindChatText(e.target.value)
        if (e.target.value.trim() === '') {
            setfindChatsMsg([])
        }
        else findChat(e.target.value)
    }

    function findChat(text: string) {
        console.log(all_messages)
        if (all_messages) {
            let arr_find = []
            for (let i = 0; i < all_messages.length; i++) {
                if (all_messages[i].text.toLowerCase().indexOf(text.toLowerCase()) !== -1 || all_messages[i].file_content.toLowerCase().indexOf(text.toLowerCase()) !== -1) {
                    // console.log(all_messages[i].text, text)
                    arr_find.push(all_messages[i])
                }
            }
            setfindChatsMsg(arr_find)
        }
    }

    const handleFocusChatInput = () => {
        getAllMessages((data) => {
            console.log(data)
            all_messages = data.all_messages
        })
    }

    function handleClickQuotedMessage(id: number) {
        const objDiv = document.getElementById("messages");
        const divMessage = document.getElementById('mess' + id.toString())
        if (divMessage && objDiv) objDiv.scrollTop = divMessage.offsetTop - 100;

        if (divMessage) {
            divMessage.classList.add('find_message')
            setTimeout(() => divMessage.classList.remove('find_message'), 2000)
        }
    }

    function handleDoubleClick(index: number) {
        console.log('handleDoubleClick', index)
        setQoutedMessageIndex(index)
    }



    useEffect(() => {
        if (userId === 0) navigate('/', { replace: true })
    }, []);

    useEffect(() => {
        getChats({ user_id: userId }, (data) => {
            setChats(data.chats)
            chats_ = data.chats
        })
    }, []);

    useEffect(() => {
        getMessages({ chat_id: currentChatId, user_id: userId }, (data) => {
            var objDiv = document.getElementById("messages");
            if (objDiv) objDiv.scrollTop = objDiv.scrollHeight
            setChatMessages(data.messages)
        })
    }, []);

    useEffect(() => {
        socket.on('newmessage', handleSocket)
        return () => {
            socket.removeAllListeners('newmessage');
        }
    }, []);

    useEffect(() => {
        socket.on('serveron', () => setServerOn(true))
        return () => {
            socket.removeAllListeners('serveron');
        }
    }, []);

    const handleKeyPress = (event: { ctrlKey: any; code: string; preventDefault: () => void; }) => {

        console.log('event.ctrlKey', event.ctrlKey, event.code)
        if ((event.code === "Enter" || event.code === 'NumpadEnter') && event.ctrlKey) {
            // console.log('новая строка')
            let inp = document.getElementById('inputmessage') as HTMLInputElement
            let cur_pos = 0
            if (inp) cur_pos = inp.selectionStart || 0
            console.log('pos', cur_pos)
            if (inp) setMessage(inp.innerHTML.slice(0, cur_pos) + '\n' + inp.innerHTML.slice(cur_pos))
            if (inp) inp.style.height = inp?.scrollHeight + 'px'
            // event.preventDefault();
            // setMessage(message + '\n')
            // event.preventDefault();
            // let btnsend = document.getElementById("btnsend")
            // if (btnsend) btnsend.click();
            // setMessage('')
        }
        else if (event.code === "Enter" || event.code === 'NumpadEnter') {
            // console.log('отправить сообщение')
            event.preventDefault();
            let btnsend = document.getElementById("btnsend")
            if (btnsend) btnsend.click();
        }

    }

    useEffect(() => {
        var elem = document.getElementById('inputmessage');


        if (elem) elem.addEventListener("keypress", handleKeyPress);
        // if (elem) elem.addEventListener("keydown", function (event) {
        //     if (event.key === 'ArrowDown') {
        //         event.preventDefault();
        //         // let inp = document.getElementById('inputmessage')
        //         let value_inp = (document.getElementById('inputmessage') as HTMLInputElement).value
        //         if (value_inp) setMessage(value_inp + '\n')
        //     }
        // });

        return () => {
            if (elem) elem.removeEventListener('keypress', handleKeyPress)
        }
    }, []);

    useEffect(() => {
        const objDiv = document.getElementById('messages')
        if (objDiv) objDiv.addEventListener('scroll', handleScroll)
    }, []);

    return (
        <>
            <div className="cntr_main">
                <div onClick={() => sendMessageTest({ text: 'test' })} className='number_chat'>Пользователь {userName}</div>
                <div className={'indicator_server ' + (serverOn ? 'indicator_server_on' : 'indicator_server_off')}></div>

                <div className='finder'>
                    <input placeholder='Поиск...' value={findText} onChange={handleFind} />
                </div>
                <div className='cntr__find_chat'>
                    {findChatText &&
                        <svg onClick={() => setFindChatText('')} className='close_find_svg' xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="#080341" />
                        </svg>
                    }
                    <input onFocus={handleFocusChatInput} className='input__find_chat' placeholder='Поиск чатов' value={findChatText} onChange={handleFindChat} />
                </div>
                <div className="cntr_chats">

                    {findChatText.length === 0 &&
                        chats.map((chat: { name: string, id: number, q_not_read: number }, index: number) => {
                            return (
                                <div key={index} className={chat.id === currentChatId ? 'cntr_chat_item_current' : 'cntr_chat_item'}
                                    onClick={() => handleClickChatItem(chat.id)}
                                >
                                    {chat.name}
                                    {(
                                        chat.id === newMessageChatId ||
                                        chat.q_not_read !== 0
                                    ) && <span className='sign_new_message'>{chat.q_not_read || '!'}</span>}
                                </div>
                            )
                        })
                    }
                    {
                        findChatText.length > 0 &&
                        findChatsMsg.map((msg, index) => {
                            return (
                                <div onClick={() => handleClickFindChat(msg.chat_id, msg.id)} className='cntr__chat_find'>
                                    <div className='chat_name'>{msg.name}</div>
                                    <div className='msg_text'>{msg.text}</div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="cntr_messages">
                    <div onClick={() => scrollToBottom()} className='arrow_down_scroll'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 1024 1024" version="1.1">
                            <path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#000000" />
                        </svg>
                    </div>
                    <div id='messages' className='messages'>
                        {
                            chatMessages.map((message: {
                                text: string,
                                id: number,
                                is_file: number,
                                user_id: number,
                                user_name: string,
                                datetime: string,
                                qm_id: number,
                                qm_user_name: string,
                                qm_text: string
                            }, index: number) => {
                                return (
                                    <div
                                        onDoubleClick={() => handleDoubleClick(index)}
                                        id={'mess' + message.id.toString()}
                                        key={index} className='row_message'
                                        style={message.user_id === userId ? { justifyContent: 'right' } : { justifyContent: 'left' }}
                                    >

                                        <div className='cntr_message_item'>
                                            {
                                                message.qm_id &&
                                                <div className='cntr_quoted_message' onClick={() => handleClickQuotedMessage(message.qm_id)}>
                                                    <label className='user_name'>{message.qm_user_name}</label>
                                                    <div className='message_text'>{message.qm_text}</div>
                                                </div>
                                            }
                                            <label className='user_name'>{message.user_name}</label>
                                            <div>
                                                {
                                                    message.is_file ?

                                                        (message.text.slice(message.text.lastIndexOf('.')) === '.jpg' || message.text.slice(message.text.lastIndexOf('.')) === '.png' ?
                                                            <img style={{ width: '90%' }} src={(message.user_id === 2 || message.user_id === 12 ? 'https://testapi.na4u.ru/static/uploads/' : 'http://5.63.153.239:443/static/uploads/') + message.text} alt='' /> :
                                                            message.text.slice(message.text.lastIndexOf('.')) === '.mp4' ?
                                                                <video style={{ width: '90%' }} controls={true}>
                                                                    <source src={(message.user_id === 2 || message.user_id === 12 ? 'https://testapi.na4u.ru/static/uploads/' : 'http://5.63.153.239:443/static/uploads/') + message.text} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                                                                </video> :
                                                                <a rel='noreferrer' download href={(message.user_id === 2 || message.user_id === 12 ? 'https://testapi.na4u.ru/static/uploads/' : 'http://5.63.153.239:443/static/uploads/') + message.text} target='_blank'>{message.text}</a>

                                                        ) :
                                                        <div className='message_text'>{message.text}</div>

                                                }
                                            </div>
                                            <div className='datetime'>{message.datetime.slice(0, 10)} {message.datetime.slice(11, 19)}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>
                        {
                            qoutedMessageIndex !== 0 &&
                            <div className='quoted_msg_input'>
                                <svg onClick={() => setQoutedMessageIndex(0)} className='close_svg' xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z" fill="#080341" />
                                </svg>
                                <div className='cntr_quoted_message'>
                                    <label className='user_name'>{chatMessages[qoutedMessageIndex].user_name}</label>
                                    <div className='message_text'>{chatMessages[qoutedMessageIndex].text}</div>
                                </div>
                            </div>
                        }
                        <div className='cntr_input_message'>

                            <div className='file_upload'>
                                <label htmlFor="myfile">
                                    <svg className='svg_file' width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H12M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V12M17 19H21M19 17V21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </label>
                                <input id='myfile' type='file' name='myfile'
                                    onChange={() => {
                                        console.log('onChange')
                                        let file = document.getElementById("myfile") as HTMLInputElement
                                        if (file) {
                                            if (file.files) {
                                                // console.log(file.files[0])
                                                setUploadFile(file.files[0])
                                            }
                                        }
                                    }}
                                >

                                </input>
                            </div>

                            {
                                uploadFile ?
                                    <div style={{ width: '60vw' }}>{uploadFile.name}</div> :
                                    // <input 
                                    //     id='inputmessage' 
                                    //     className='input_message' 
                                    //     placeholder='Сообщение...' 
                                    //     value={message} onChange={(e) => setMessage(e.target.value)} 
                                    // />
                                    // <TextareaAutosize  
                                    //         id='inputmessage' 
                                    //         className="input_message nores" 
                                    //         value={message} 
                                    //         placeholder="Сообщение..." 
                                    //         minRows={2}
                                    //         onChange={(e) => setMessage(e.target.value)}
                                    // />
                                    <textarea id='inputmessage'
                                        className="input_message nores"
                                        value={message}
                                        placeholder="Сообщение..."
                                        onChange={(e) => {
                                            // console.log(e.target.value)
                                            setMessage(e.target.value)
                                        }}
                                    >

                                    </textarea>
                            }
                            <button id='btnsend' onClick={handleClickSendMessage}>
                                <svg className='svg_file' width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
