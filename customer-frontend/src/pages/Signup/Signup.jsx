import {
useState
} from 'react';
import {
Link,useNavigate
} from 'react-router-dom';
import '../Login/Login.css';
import './Signup.css';

export default function Signup(){
const navigate=useNavigate();
const[data,setData]=useState({
name:'',email:'',phone:'',password:'',confirm:''
}),[message,setMessage]=useState('');
const update=e=>setData({
...data,[e.target.name]:e.target.value
});
function submit(e){
e.preventDefault();
if(Object.values(data).some(x=>!x))return setMessage('Please complete every field.');
if(data.password!==data.confirm)return setMessage('Passwords do not match.');
localStorage.setItem('SkillBridge-demo-profile',JSON.stringify({
name:data.name,email:data.email,phone:data.phone
}));
localStorage.setItem('SkillBridge-demo-session','true');
navigate('/customer')
}return <div className="auth-page">
<form className="auth-card" onSubmit={
submit
}>
<Link className="auth-brand" to="/customer">Skill<span>Build</span>
</Link>
<h1>Create account</h1>
<p className="intro">Set up your customer account.</p>
<p className="placeholder-note">Demo mode: registration opens the customer dashboard. Firebase will replace this temporary local session.</p>{
message&&<p className="error-state">{
message
}</p>
}{
[['name','Full name','text'],['email','Email address','email'],['phone','Phone number','tel'],['password','Password','password'],['confirm','Confirm password','password']].map(([n,l,type])=>
<label key={
n
}>{
l
}<input required name={
n
} type={
type
} value={
data[n]
} onChange={
update
}/>
</label>)
}<button className="primary">Create account</button>
<p className="auth-footer">Already have an account? <Link to="/login">Log in</Link>
</p>
</form>
</div>
}
