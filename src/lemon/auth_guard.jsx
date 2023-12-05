import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Token } from './access_token';
import Cookies from 'universal-cookie';

const AuthGuard = ({component, identityContract, account}) => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(false);

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async () =>{
        const cookies = new Cookies();
        const token = cookies.get('access_token');
        if(!token) {
            console.log("No token found. Redirecting to login page.");
            navigate("/login");
        }else{
            const cipher = await identityContract.methods.getUserCipher().call({ from: account });
            try {
                console.log(Token.getPayload(token,cipher, account));
                setStatus(true)
            } catch (error) {
                console.log("Invalid token. Redirecting to login page.");
                navigate("/login");
            }
        }
    }

    return status ? <React.Fragment>{component}</React.Fragment> : <React.Fragment></React.Fragment>;
}

export default AuthGuard;