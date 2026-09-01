import {
useState
} from 'react';
 import {
Link,useNavigate,useSearchParams
} from 'react-router-dom';
 import {
Eye,EyeOff
} from 'lucide-react';
 import './Login.css';

export default function Login(){
const nav=useNavigate(),[params]=useSearchParams();
const savedProfile=JSON.parse(localStorage.getItem('SkillBridge-demo-profile')||'null');
const[email,setEmail]=useState(savedProfile?.email||''),[password,setPassword]=useState(''),[rememberMe,setRememberMe]=useState(()=>localStorage.getItem('SkillBridge-remember-me')==='true'),[show,setShow]=useState(false),[error,setError]=useState('');
function submit(e){
e.preventDefault();
setError('');
if(!email||!password)return setError('Enter your email and password.');
localStorage.setItem('SkillBridge-remember-me',rememberMe);
localStorage.setItem('SkillBridge-demo-session','true');
nav('/customer')
} return <div className="auth-page">
<form className="auth-card" onSubmit={
submit
}>
<Link className="auth-brand" to="/customer">Skill<span>Build</span>
</Link>
<h1>Welcome back</h1>
<p className="intro">Sign in to book reliable local help.</p>
<p className="placeholder-note">Demo mode: Firebase authentication will be connected by the backend team.</p>{
params.get('registered')&&<p className="success-message">Registration form completed. You can now use this placeholder login.</p>
}{
error&&<p className="error-state">{
error
}</p>
}<label>Email address<input type="email" value={
email
} onChange={
e=>setEmail(e.target.value)
} autoComplete="email"/>
</label>
<label>Password<span className="password-field">
<input type={
show?'text':'password'
} value={
password
} onChange={
e=>setPassword(e.target.value)
} autoComplete="current-password"/>
<button type="button" onClick={
()=>setShow(!show)
} aria-label="Show password">{
show?<EyeOff/>:<Eye/>
}</button>
</span>
</label>
<div className="form-row">
<label className="check">
<input type="checkbox" checked={
rememberMe
} onChange={
e=>setRememberMe(e.target.checked)
}/>Remember me</label>
<Link to="/forgot-password">Forgot password?</Link>
</div>
<button className="primary">Log in</button>
<p className="auth-footer">Don’t have an account? <Link to="/signup">Create account</Link>
</p>
</form>
</div>
}
