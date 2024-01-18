/* eslint-disable react/style-prop-object */
import { useEffect, useState } from 'react';
import { sendLogin } from './startApi';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setUserId, setUserName } from './startSlice';


export function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (login.trim() && password.trim()) sendLogin({login: login, password: password}, (data) => {
            if (data.res) {
                localStorage.setItem('login', login)
                localStorage.setItem('password', password)
                dispatch(setUserName(login))
                dispatch(setUserId(data.user_id))
                navigate('/start', {replace: true})
            }
        })
    }

    useEffect(() => {
        const local_login = localStorage.getItem('login')
        const local_password = localStorage.getItem('password')
        if (local_login) setLogin(local_login)
        if (local_password) setPassword(local_password)
    }, []);

    return (
        <>
            <div className="cntr_login">
                <div className='cntr_form'>
                    <div>
                        <input className='input_login' placeholder='login..'
                            value={login}
                            onChange={(e) => {
                                setLogin(e.target.value)
                            }}
                        />
                    </div>
                    <div>
                        <input className='input_login' placeholder='password..'
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />
                    </div>
                    <div className='btn_login'
                        onClick={handleLogin}
                    >
                        Войти
                    </div>
                </div>
            </div>
        </>
    );
}
