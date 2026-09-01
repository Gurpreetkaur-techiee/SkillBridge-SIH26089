import {
CircleAlert
} from 'lucide-react';
 export default function ErrorState({
message
}){
return <div className="error-state">
<CircleAlert size={
18
}/>{
message
}</div>
}
