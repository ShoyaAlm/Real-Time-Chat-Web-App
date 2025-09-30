import { useState } from "react"
import './css/signup-login.css'
import {Link} from 'react-router-dom'

const baseURL = 'http://localhost:8080/api/v1'

const Signup = () => {


    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [image, setImage] = useState('')
    const [bio, setBio] = useState('')
    
    
        const handleSignup = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseURL}/user/register`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    image,
                    bio
                })
            })

            const loginData = await response.json()

            if(!response.ok){
                console.log('Error occurred while logging in: ', loginData);
            }
            
            localStorage.setItem('token', loginData.token)

            alert(`Welcome to our new member, ${loginData.user.name}`)
            
            window.location.reload();

        } catch (error) {
            console.log(error);
        } finally{
            setName('')
            setUsername('')
            setPassword('')
            setImage(null)
            setBio('')
        }

    }

    return (

        <div className="login-form-container">

        <h2 className="welcome-message">Welcome to Chat-App</h2>

        <form className="login-form">
        <h1>Signup</h1>

            <div style={{position:'relative', left:'-12px'}}>
                <label htmlFor="name">Name </label> <br />
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                required autoComplete="name" />
            </div>

            <div style={{position:'relative', left:'-12px'}}>
                <label htmlFor="username">Username </label> <br />
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                required autoComplete="username" />
            </div>

            <div style={{position:'relative', left:'-12px', marginTop:'20px'}}>
                <label htmlFor="password">Password </label> <br />
                <input type="text" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required autoComplete="password" />
            </div>

            <div style={{position:'relative', left:'-12px', marginTop:'20px'}}>
                <label htmlFor="image">Image </label> <br />
                <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])}
                accept="image/*" />
            </div>

            <div style={{position:'relative', left:'-12px', marginTop:'20px'}}>
                <label htmlFor="bio">Bio </label> <br />
                <input type="text" id="bio" value={bio} onChange={(e) => setBio(e.target.value)}
                autoComplete="bio" />
            </div>

            <button type="submit" style={{marginTop:'20px'}}
            onClick={(e) => handleSignup(e)}
            >Signup</button>

            <p style={{position:'relative'}}>You have an account? <Link to="/login">Login</Link></p>

        </form>

        </div>
    )
}

const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${baseURL}/user/login`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            })

            const loginData = await response.json()

            if(!response.ok){
                console.log('Error occurred while logging in: ', loginData);
            }
            
            localStorage.setItem('token', loginData.token)

            alert(`Welcome back ${loginData.user.name}`)
            
            window.location.reload();

        } catch (error) {
            console.log(error);
        } finally{
            setUsername('')
            setPassword('')
        }

    }

    return (


        <div className="login-form-container">

        <h2 className="welcome-message">Welcome Back to Chat-App</h2>

        <form className="login-form">
        <h1>Login</h1>
            
            <div style={{position:'relative', left:'-12px'}}>
                <label htmlFor="username">Username </label> <br />
                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}
                required autoComplete="username" />
            </div>

            <div style={{position:'relative', left:'-12px', marginTop:'20px'}}>
                <label htmlFor="password">Password </label> <br />
                <input type="text" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required autoComplete="password" />
            </div>

            <button type="submit" style={{marginTop:'20px'}}
            onClick={(e) => handleLogin(e)}
            >Login</button>

            <p style={{position:'relative'}}>You're new? Just <Link to="/signup">signup</Link> already!</p>

        </form>

        </div>

    )

}


export {Signup, Login}