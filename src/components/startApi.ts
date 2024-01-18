import { url } from "./constants";

export function getChats(pars: { user_id: number }, callback: (data: any) => void) {
    fetch(url + '/getchats', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // mode: 'no-cors',
        body: JSON.stringify(pars)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('data getchats', data)
            return callback(data)
        });
}

export function getMessages(pars: { chat_id: number, user_id: number }, callback: (data: any) => void) {
    fetch(url + '/getmessages', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // mode: 'no-cors',
        body: JSON.stringify(pars)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('data getmessages', data)
            return callback(data)
        });
}

export function getAllMessages( callback: (data: any) => void ) {
    fetch(url + '/getallmessages', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log('data getmessages', data)
            return callback(data)
        });
}

export function sendMessage(pars: { text: string, chat_id: number, quoted_msg_id: string, user_id: number }, callback: (data: any) => void) {


    //to backend
    fetch(url + '/sendmessage', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // mode: 'no-cors',
        body: JSON.stringify(pars)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('data sendmessage', data)
            return callback(data)

        });
}

export function sendMessageWA(pars: { text: string, chat_id: number, id: number, serialized_id: string }, callback: (data: any) => void) {
    console.log('sendMessageWA ', pars.text)
    // to wa server
    // fetch('//5.63.153.239:3000/', {
    fetch(url + '/sendmessagewa', {

        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // mode: 'no-cors',
        body: JSON.stringify(pars)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('data sendMessageWA ', data)
            return callback(data)

        });
}



export function sendMessageFile(pars: { upload_file: any, chat_id: any, user_id: any }, callback: (data: any) => void) {
    console.log('sendMessageFile', pars)
    let formData = new FormData();
    formData.append('message_file', pars.upload_file);
    formData.append('chat_id', pars.chat_id);
    formData.append('user_id', pars.user_id);

    fetch(url + '/sendmessagefile', {
        method: 'POST',
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('data sendmessagefile', data)
            // fetch('http://u2282154.isp.regruhosting.ru:443/file', {
            //     method: 'POST',
            //     body: formData
            // })
            //     .then((response) => response.json())
            //     .then((data) => {
            //         console.log('data sendmessagefile', data)
            //         return callback(data)
            //     });
            return callback(data)
        });


}


export function sendMessageTest(pars: { text: string}) {
    console.log('sendMessageWA ', pars.text)
    
    fetch(url + '/sendmessagetest', {

        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // mode: 'no-cors',
        body: JSON.stringify(pars)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('data sendmessage test', data)
            // return callback(data)F

        });
}

export function sendLogin(pars: { login: string, password: string }, callback: (data: any) => void) {
    fetch(url + '/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        // mode: 'no-cors',
        body: JSON.stringify(pars)
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('data login', data)
            return callback(data)
        });
}