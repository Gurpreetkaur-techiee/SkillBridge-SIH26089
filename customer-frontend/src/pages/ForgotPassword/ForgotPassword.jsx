import {
useState
} from 'react';
import {
Link
} from 'react-router-dom';
import {
authGateway
} from '../../services/integrations';
import {
useApp
} from '../../context/AppContext';
import '../Login/Login.css';
import './ForgotPassword.css';

export default function ForgotPassword(){
const{
t
}=useApp(),[email,setEmail]=useState(''),[state,setState]=useState('idle'),[error,setError]=useState('');
async function submit(e){
e.preventDefault();
setState('sending');
try{
await authGateway.resetPassword(email);
setState('success')
}catch(x){
setError(x.message);
setState('error')
}
}return <div className="auth-page">
<form className="auth-card" onSubmit={
submit
}>
<Link className="auth-brand" to="/customer">Skill<span>Build</span>
</Link>
<h1>Reset your password</h1>{
state==='success'?<p className="success-message">If an account exists for this email, a reset link will be sent once Firebase Authentication is connected.</p>:<>
<p className="intro">Enter your email and we’ll send a reset link.</p>{
state==='error'&&<p className="error-state">{
error
}</p>
}<label>{
t('auth.email')
}<input required type="email" value={
email
} onChange={
e=>setEmail(e.target.value)
}/>
</label>
<button className="primary">{
state==='sending'?'Sending…':t('auth.reset')
}</button>
</>
}<p className="auth-footer">
<Link to="/login">← Back to login</Link>
</p>
</form>
</div>
}
